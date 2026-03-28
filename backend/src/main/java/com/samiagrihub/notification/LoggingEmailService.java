package com.samiagrihub.notification;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoggingEmailService implements EmailService {
    @Override
    public void send(String to, String subject, String body) {
        log.info("DEV email queued to={} subject={}", redactEmail(to), subject);
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
