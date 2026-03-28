package com.samiagrihub.notification;

import com.samiagrihub.common.config.EmailProperties;
import com.samiagrihub.common.exception.AppException;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Slf4j
public class HttpEmailService implements EmailService {

    private final RestClient restClient;
    private final EmailProperties emailProperties;

    public HttpEmailService(RestClient restClient, EmailProperties emailProperties) {
        this.restClient = restClient;
        this.emailProperties = emailProperties;
    }

    @Override
    public void send(String to, String subject, String body) {
        try {
            restClient.post()
                    .uri(emailProperties.deliveryPath())
                    .contentType(MediaType.APPLICATION_JSON)
                    .headers(headers -> headers.set(emailProperties.authHeaderName(), authHeaderValue()))
                    .body(buildRequestBody(to, subject, body))
                    .retrieve()
                    .toBodilessEntity();
            log.info("Email dispatched via provider to={} subject={}", redactEmail(to), subject);
        } catch (RestClientException exception) {
            log.error("Email provider dispatch failed for to={} subject={}", redactEmail(to), subject, exception);
            throw new AppException("EMAIL_DELIVERY_FAILED", "Unable to send email right now", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private Map<String, Object> buildRequestBody(String to, String subject, String body) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("to", to);
        payload.put("subject", subject);
        payload.put("body", body);
        payload.put("fromAddress", emailProperties.fromAddress());
        payload.put("fromName", emailProperties.fromName());
        if (emailProperties.replyTo() != null && !emailProperties.replyTo().isBlank()) {
            payload.put("replyTo", emailProperties.replyTo());
        }
        return payload;
    }

    private String authHeaderValue() {
        if ("Authorization".equalsIgnoreCase(emailProperties.authHeaderName())
                && emailProperties.authToken() != null
                && !emailProperties.authToken().startsWith("Bearer ")) {
            return "Bearer " + emailProperties.authToken();
        }
        return emailProperties.authToken();
    }

    private String redactEmail(String email) {
        if (email == null || email.isBlank()) {
            return "***";
        }
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) {
            return "***";
        }
        return email.charAt(0) + "***" + email.substring(atIndex);
    }
}
