package com.samiagrihub.notification;

import com.samiagrihub.common.config.EmailProperties;
import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class EmailConfiguration {

    @Bean
    public EmailService emailService(EmailProperties emailProperties, Environment environment) {
        boolean devLike = environment.acceptsProfiles(Profiles.of("dev", "test"));
        String provider = emailProperties.provider() == null ? "" : emailProperties.provider().trim().toLowerCase();

        if (provider.isBlank() || "logging".equals(provider)) {
            if (!devLike) {
                throw new IllegalStateException("Email provider must be configured outside dev/test environments");
            }
            return new LoggingEmailService();
        }

        if (!emailProperties.enabled()) {
            throw new IllegalStateException("Email provider is configured but disabled");
        }

        if (!"http".equals(provider)) {
            throw new IllegalStateException("Unsupported email provider: " + emailProperties.provider());
        }

        validateHttpConfiguration(emailProperties);
        return new HttpEmailService(restClient(emailProperties), emailProperties);
    }

    private RestClient restClient(EmailProperties emailProperties) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofMillis(emailProperties.timeoutMillis()));
        requestFactory.setReadTimeout(Duration.ofMillis(emailProperties.timeoutMillis()));

        return RestClient.builder()
                .baseUrl(emailProperties.baseUrl())
                .requestFactory(requestFactory)
                .build();
    }

    private void validateHttpConfiguration(EmailProperties emailProperties) {
        require(emailProperties.baseUrl(), "Email base URL");
        require(emailProperties.deliveryPath(), "Email delivery path");
        require(emailProperties.authToken(), "Email auth token");
        require(emailProperties.authHeaderName(), "Email auth header name");
        require(emailProperties.fromAddress(), "Email from address");
        require(emailProperties.fromName(), "Email from name");
        if (emailProperties.timeoutMillis() <= 0) {
            throw new IllegalStateException("Email timeout must be greater than zero");
        }
    }

    private void require(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(fieldName + " must be configured");
        }
    }
}
