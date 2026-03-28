package com.samiagrihub.auth.controller;

import com.samiagrihub.auth.dto.LoginRequest;
import com.samiagrihub.auth.dto.RegisterRequest;
import com.samiagrihub.auth.dto.ResendOtpRequest;
import com.samiagrihub.auth.dto.VerifyOtpRequest;
import com.samiagrihub.auth.service.AuthService;
import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.AuthCookieService;
import com.samiagrihub.common.security.SecurityContextService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.web.csrf.CsrfToken;
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
    private final SecurityContextService securityContextService;

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

    @PostMapping("/logout")
    public ApiResponse<?> logout(HttpServletResponse response) {
        try {
            authService.logout(securityContextService.currentUser());
        } catch (Exception ignored) {
            // Clearing the cookie is safe even if the caller is already unauthenticated.
        }
        authCookieService.clearSessionCookie(response);
        return ApiResponse.success(java.util.Map.of("authenticated", false));
    }

    @org.springframework.web.bind.annotation.GetMapping("/csrf")
    public ApiResponse<?> csrf(CsrfToken csrfToken) {
        return ApiResponse.success(java.util.Map.of(
                "token", csrfToken.getToken(),
                "headerName", csrfToken.getHeaderName(),
                "parameterName", csrfToken.getParameterName()
        ));
    }
}
