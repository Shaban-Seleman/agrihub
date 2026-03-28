package com.samiagrihub.notification;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoggingOtpService implements OtpService {
    @Override
    public void sendOtp(String phoneNumber, String code) {
        log.info("DEV OTP issued for {}", redactPhone(phoneNumber));
        log.info("DEV OTP code={}", code);
    }

    private String redactPhone(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 4) {
            return "***";
        }
        return "***" + phoneNumber.substring(phoneNumber.length() - 4);
    }
}
