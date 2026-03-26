package com.samiagrihub.auth.dto;

public record AuthStatusResponse(
        Long userId,
        String phoneNumber,
        String accountType,
        String status,
        boolean phoneVerified
) {
}
