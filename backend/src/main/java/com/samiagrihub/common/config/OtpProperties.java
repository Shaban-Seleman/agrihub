package com.samiagrihub.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.otp")
public record OtpProperties(
        String provider,
        boolean enabled,
        String baseUrl,
        String deliveryPath,
        String authToken,
        String authHeaderName,
        String senderId,
        long timeoutMillis,
        long ttlMinutes,
        long resendCooldownSeconds
) {
}
