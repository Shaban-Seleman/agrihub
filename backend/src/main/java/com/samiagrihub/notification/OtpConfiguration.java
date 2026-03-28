package com.samiagrihub.notification;

import com.samiagrihub.common.config.OtpProperties;
import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class OtpConfiguration {

    @Bean
    public OtpService otpService(OtpProperties otpProperties, Environment environment) {
        boolean devLike = environment.acceptsProfiles(Profiles.of("dev", "test"));
        String provider = otpProperties.provider() == null ? "" : otpProperties.provider().trim().toLowerCase();

        if (provider.isBlank() || "logging".equals(provider)) {
            if (!devLike) {
                throw new IllegalStateException("OTP provider must be configured outside dev/test environments");
            }
            return new LoggingOtpService();
        }

        if (!otpProperties.enabled()) {
            throw new IllegalStateException("OTP provider is configured but disabled");
        }

        if (!"http".equals(provider)) {
            throw new IllegalStateException("Unsupported OTP provider: " + otpProperties.provider());
        }

        validateHttpConfiguration(otpProperties);
        return new HttpOtpService(restClient(otpProperties), otpProperties);
    }

    private RestClient restClient(OtpProperties otpProperties) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofMillis(otpProperties.timeoutMillis()));
        requestFactory.setReadTimeout(Duration.ofMillis(otpProperties.timeoutMillis()));

        return RestClient.builder()
                .baseUrl(otpProperties.baseUrl())
                .requestFactory(requestFactory)
                .build();
    }

    private void validateHttpConfiguration(OtpProperties otpProperties) {
        require(otpProperties.baseUrl(), "OTP base URL");
        require(otpProperties.deliveryPath(), "OTP delivery path");
        require(otpProperties.authToken(), "OTP auth token");
        require(otpProperties.authHeaderName(), "OTP auth header name");
        require(otpProperties.senderId(), "OTP sender ID");
        if (otpProperties.timeoutMillis() <= 0) {
            throw new IllegalStateException("OTP timeout must be greater than zero");
        }
    }

    private void require(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(fieldName + " must be configured");
        }
    }
}
