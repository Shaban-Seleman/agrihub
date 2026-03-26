package com.samiagrihub.user.dto;

public record MeResponse(
        Long userId,
        String phoneNumber,
        String accountType,
        String status
) {
}
