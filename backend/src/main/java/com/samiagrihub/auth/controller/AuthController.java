package com.samiagrihub.auth.controller;

import com.samiagrihub.auth.dto.LoginRequest;
import com.samiagrihub.auth.dto.RegisterRequest;
import com.samiagrihub.auth.dto.ResendOtpRequest;
import com.samiagrihub.auth.dto.VerifyOtpRequest;
import com.samiagrihub.auth.service.AuthService;
import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.AuthCookieService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService authCookieService;

    @PostMapping("/register")
    public ApiResponse<?> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request));
    }

    @PostMapping("/verify-otp")
    public ApiResponse<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ApiResponse.success(authService.verifyOtp(request));
    }

    @PostMapping("/resend-otp")
    public ApiResponse<?> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        return ApiResponse.success(authService.resendOtp(request));
    }

    @PostMapping("/login")
    public ApiResponse<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        String token = authService.login(request);
        authCookieService.writeSessionCookie(response, token);
        return ApiResponse.success(java.util.Map.of("authenticated", true));
    }
}
