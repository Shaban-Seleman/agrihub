package com.samiagrihub.auth.service;

import com.samiagrihub.auth.dto.AuthStatusResponse;
import com.samiagrihub.auth.dto.LoginRequest;
import com.samiagrihub.auth.dto.RegisterRequest;
import com.samiagrihub.auth.dto.ResendOtpRequest;
import com.samiagrihub.auth.dto.VerifyOtpRequest;
import com.samiagrihub.auth.entity.OtpChallenge;
import com.samiagrihub.auth.repository.OtpChallengeRepository;
import com.samiagrihub.common.audit.AuditAction;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.config.OtpProperties;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.ratelimit.RateLimitService;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.common.security.JwtTokenService;
import com.samiagrihub.notification.OtpService;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.entity.UserProfile;
import com.samiagrihub.user.entity.UserStatus;
import com.samiagrihub.user.repository.UserProfileRepository;
import com.samiagrihub.user.repository.UserRepository;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final OtpChallengeRepository otpChallengeRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final OtpProperties otpProperties;
    private final RateLimitService rateLimitService;
    private final JwtTokenService jwtTokenService;
    private final AuditService auditService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public AuthStatusResponse register(RegisterRequest request) {
        if (request.accountType() == AccountType.ADMIN || request.accountType() == AccountType.DONOR_VIEWER) {
            throw new AppException("INVALID_ACCOUNT_TYPE", "This account type cannot use public registration", HttpStatus.BAD_REQUEST);
        }
        userRepository.findByPhoneNumber(request.phoneNumber()).ifPresent(user -> {
            throw new AppException("PHONE_ALREADY_EXISTS", "Phone number is already registered", HttpStatus.CONFLICT);
        });

        User user = userRepository.save(User.builder()
                .phoneNumber(request.phoneNumber())
                .passwordHash(passwordEncoder.encode(request.password()))
                .accountType(request.accountType())
                .status(UserStatus.PENDING_OTP)
                .phoneVerified(false)
                .build());

        userProfileRepository.save(UserProfile.builder()
                .user(user)
                .fullName(request.fullName())
                .build());

        issueOtp(user);
        auditService.log(user.getId(), AuditAction.USER_REGISTERED, "USER", String.valueOf(user.getId()), request.phoneNumber());
        return toStatus(user);
    }

    @Transactional
    public AuthStatusResponse verifyOtp(VerifyOtpRequest request) {
        User user = getUserByPhone(request.phoneNumber());
        OtpChallenge challenge = otpChallengeRepository.findTopByUserOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new AppException("OTP_NOT_FOUND", "No OTP challenge found", HttpStatus.BAD_REQUEST));

        if (challenge.getVerifiedAt() != null) {
            return toStatus(user);
        }
        if (challenge.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new AppException("OTP_EXPIRED", "OTP code has expired", HttpStatus.BAD_REQUEST);
        }
        if (!challenge.getOtpCode().equals(request.otpCode())) {
            throw new AppException("OTP_INVALID", "OTP code is invalid", HttpStatus.BAD_REQUEST);
        }

        challenge.setVerifiedAt(OffsetDateTime.now());
        otpChallengeRepository.save(challenge);
        user.setPhoneVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        auditService.log(user.getId(), AuditAction.OTP_VERIFIED, "USER", String.valueOf(user.getId()), null);
        return toStatus(user);
    }

    @Transactional
    public AuthStatusResponse resendOtp(ResendOtpRequest request) {
        rateLimitService.check("otp-resend:" + request.phoneNumber(), 3, Duration.ofMinutes(10));
        User user = getUserByPhone(request.phoneNumber());
        OtpChallenge latest = otpChallengeRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);
        if (latest != null && latest.getCreatedAt().plusSeconds(otpProperties.resendCooldownSeconds()).isAfter(OffsetDateTime.now())) {
            throw new AppException("OTP_RESEND_COOLDOWN", "Please wait before requesting another OTP", HttpStatus.TOO_MANY_REQUESTS);
        }
        issueOtp(user);
        return toStatus(user);
    }

    public String login(LoginRequest request) {
        rateLimitService.check("login:" + request.phoneNumber(), 5, Duration.ofMinutes(15));
        User user = getUserByPhone(request.phoneNumber());
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            auditService.log(user.getId(), AuditAction.LOGIN_FAILED, "USER", String.valueOf(user.getId()), null);
            throw new AppException("INVALID_CREDENTIALS", "Invalid phone number or password", HttpStatus.UNAUTHORIZED);
        }
        if (!user.isPhoneVerified() || user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException("ACCOUNT_NOT_ACTIVE", "Please verify your phone number before login", HttpStatus.UNAUTHORIZED);
        }
        auditService.log(user.getId(), AuditAction.LOGIN_SUCCESS, "USER", String.valueOf(user.getId()), null);
        return jwtTokenService.generateToken(AppUserPrincipal.builder()
                .userId(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .accountType(user.getAccountType())
                .build());
    }

    public void logout(AppUserPrincipal principal) {
        auditService.log(principal.getUserId(), AuditAction.LOGOUT, "USER", String.valueOf(principal.getUserId()), null);
    }

    private void issueOtp(User user) {
        String code = "%06d".formatted(secureRandom.nextInt(1_000_000));
        otpChallengeRepository.save(OtpChallenge.builder()
                .user(user)
                .otpCode(code)
                .expiresAt(OffsetDateTime.now().plusMinutes(otpProperties.ttlMinutes()))
                .build());
        otpService.sendOtp(user.getPhoneNumber(), code);
    }

    private User getUserByPhone(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new AppException("USER_NOT_FOUND", "User was not found", HttpStatus.NOT_FOUND));
    }

    private AuthStatusResponse toStatus(User user) {
        return new AuthStatusResponse(user.getId(), user.getPhoneNumber(), user.getAccountType().name(), user.getStatus().name(), user.isPhoneVerified());
    }
}
