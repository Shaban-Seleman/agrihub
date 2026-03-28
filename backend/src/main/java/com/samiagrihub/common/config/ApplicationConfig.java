package com.samiagrihub.common.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({
        JwtProperties.class,
        OtpProperties.class,
        EmailProperties.class,
        SeedProperties.class,
        CorsProperties.class
})
public class ApplicationConfig {
}
