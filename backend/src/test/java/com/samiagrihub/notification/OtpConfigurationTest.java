package com.samiagrihub.notification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.samiagrihub.common.config.OtpProperties;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class OtpConfigurationTest {

    private final OtpConfiguration configuration = new OtpConfiguration();

    @Test
    void shouldUseLoggingProviderInDev() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("dev");

        OtpService otpService = configuration.otpService(
                new OtpProperties("logging", false, "", "", "", "Authorization", "", 5000, 10, 60),
                environment
        );

        assertThat(otpService).isInstanceOf(LoggingOtpService.class);
    }

    @Test
    void shouldFailClosedOutsideDevWhenProviderMissing() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("staging");

        assertThatThrownBy(() -> configuration.otpService(
                new OtpProperties("", false, "", "", "", "Authorization", "", 5000, 10, 60),
                environment
        )).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("OTP provider must be configured");
    }

    @Test
    void shouldFailClosedWhenHttpProviderDisabled() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("staging");

        assertThatThrownBy(() -> configuration.otpService(
                new OtpProperties("http", false, "https://otp.example.com", "/messages/otp", "token", "Authorization", "SAMIAGRI", 5000, 10, 60),
                environment
        )).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("configured but disabled");
    }
}
