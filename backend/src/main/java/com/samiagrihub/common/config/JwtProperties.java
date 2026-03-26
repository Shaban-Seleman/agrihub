package com.samiagrihub.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public record JwtProperties(
        String jwtSecret,
        long accessTokenMinutes,
        String cookieName,
        boolean cookieSecure
) {
}
