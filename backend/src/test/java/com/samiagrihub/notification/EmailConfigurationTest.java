package com.samiagrihub.notification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.samiagrihub.common.config.EmailProperties;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class EmailConfigurationTest {

    private final EmailConfiguration configuration = new EmailConfiguration();

    @Test
    void shouldUseLoggingProviderInDev() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("dev");

        EmailService emailService = configuration.emailService(
                new EmailProperties("logging", false, "", "", "", "Authorization", "", "", "", 5000),
                environment
        );

        assertThat(emailService).isInstanceOf(LoggingEmailService.class);
    }

    @Test
    void shouldFailClosedOutsideDevWhenProviderMissing() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("staging");

        assertThatThrownBy(() -> configuration.emailService(
                new EmailProperties("", false, "", "", "", "Authorization", "", "", "", 5000),
                environment
        )).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Email provider must be configured");
    }

    @Test
    void shouldFailClosedWhenHttpProviderDisabled() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("staging");

        assertThatThrownBy(() -> configuration.emailService(
                new EmailProperties("http", false, "https://email.example.com", "/messages/email", "token", "Authorization", "no-reply@example.com", "SamiAgriHub", "", 5000),
                environment
        )).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("configured but disabled");
    }
}
