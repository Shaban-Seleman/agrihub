package com.samiagrihub.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LoggingOtpService implements OtpService {
    @Override
    public void sendOtp(String phoneNumber, String code) {
        log.info("OTP for {} is {}", phoneNumber, code);
    }
}
