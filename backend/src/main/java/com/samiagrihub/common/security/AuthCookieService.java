package com.samiagrihub.common.security;

import com.samiagrihub.common.config.JwtProperties;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieService {

    private final JwtProperties jwtProperties;

    public AuthCookieService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public void writeSessionCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from(jwtProperties.cookieName(), token)
                .httpOnly(true)
                .secure(jwtProperties.cookieSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(jwtProperties.accessTokenMinutes() * 60)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void clearSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(jwtProperties.cookieName(), "")
                .httpOnly(true)
                .secure(jwtProperties.cookieSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}
