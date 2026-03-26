package com.samiagrihub.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.otp")
public record OtpProperties(
        long ttlMinutes,
        long resendCooldownSeconds
) {
}
