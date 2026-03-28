package com.samiagrihub.notification;

import com.samiagrihub.common.config.OtpProperties;
import com.samiagrihub.common.exception.AppException;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Slf4j
public class HttpOtpService implements OtpService {

    private final RestClient restClient;
    private final OtpProperties otpProperties;

    public HttpOtpService(RestClient restClient, OtpProperties otpProperties) {
        this.restClient = restClient;
        this.otpProperties = otpProperties;
    }

    @Override
    public void sendOtp(String phoneNumber, String code) {
        try {
            restClient.post()
                    .uri(otpProperties.deliveryPath())
                    .contentType(MediaType.APPLICATION_JSON)
                    .headers(headers -> headers.set(otpProperties.authHeaderName(), authHeaderValue()))
                    .body(Map.of(
                            "phoneNumber", phoneNumber,
                            "senderId", otpProperties.senderId(),
                            "message", buildMessage(code),
                            "channel", "sms"
                    ))
                    .retrieve()
                    .toBodilessEntity();
            log.info("OTP dispatched via provider to {}", redactPhone(phoneNumber));
        } catch (RestClientException exception) {
            log.error("OTP provider dispatch failed for {}", redactPhone(phoneNumber), exception);
            throw new AppException("OTP_DELIVERY_FAILED", "Unable to send OTP right now", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private String buildMessage(String code) {
        return "Your SamiAgriHub OTP is %s. It expires in %d minutes."
                .formatted(code, otpProperties.ttlMinutes());
    }

    private String authHeaderValue() {
        if ("Authorization".equalsIgnoreCase(otpProperties.authHeaderName())
                && otpProperties.authToken() != null
                && !otpProperties.authToken().startsWith("Bearer ")) {
            return "Bearer " + otpProperties.authToken();
        }
        return otpProperties.authToken();
    }

    private String redactPhone(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 4) {
            return "***";
        }
        return "***" + phoneNumber.substring(phoneNumber.length() - 4);
    }
}
