package com.samiagrihub.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.email")
public record EmailProperties(
        String provider,
        boolean enabled,
        String baseUrl,
        String deliveryPath,
        String authToken,
        String authHeaderName,
        String fromAddress,
        String fromName,
        String replyTo,
        long timeoutMillis
) {
}
