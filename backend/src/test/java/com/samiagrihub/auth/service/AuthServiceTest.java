package com.samiagrihub.auth.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.samiagrihub.auth.dto.RegisterRequest;
import com.samiagrihub.auth.repository.OtpChallengeRepository;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.config.OtpProperties;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.ratelimit.RateLimitService;
import com.samiagrihub.common.security.JwtTokenService;
import com.samiagrihub.notification.OtpService;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.repository.UserProfileRepository;
import com.samiagrihub.user.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private UserProfileRepository userProfileRepository;
    @Mock private OtpChallengeRepository otpChallengeRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private OtpService otpService;
    @Mock private RateLimitService rateLimitService;
    @Mock private JwtTokenService jwtTokenService;
    @Mock private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRejectAdminRegistration() {
        AuthService service = new AuthService(
                userRepository,
                userProfileRepository,
                otpChallengeRepository,
                passwordEncoder,
                otpService,
                new OtpProperties(10, 60),
                rateLimitService,
                jwtTokenService,
                auditService
        );

        assertThatThrownBy(() -> service.register(new RegisterRequest("+255700111222", "Password123", AccountType.ADMIN, "Admin")))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("cannot use public registration");
    }

    @Test
    void shouldRejectDuplicatePhoneRegistration() {
        AuthService service = new AuthService(
                userRepository,
                userProfileRepository,
                otpChallengeRepository,
                passwordEncoder,
                otpService,
                new OtpProperties(10, 60),
                rateLimitService,
                jwtTokenService,
                auditService
        );
        when(userRepository.findByPhoneNumber("+255700111222")).thenReturn(Optional.of(new com.samiagrihub.user.entity.User()));

        assertThatThrownBy(() -> service.register(new RegisterRequest("+255700111222", "Password123", AccountType.FARMER_YOUTH, "Existing User")))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("already registered");
    }
}
