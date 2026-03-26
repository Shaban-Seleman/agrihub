package com.samiagrihub.notification;

public interface OtpService {
    void sendOtp(String phoneNumber, String code);
}
