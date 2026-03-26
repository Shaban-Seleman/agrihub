package com.samiagrihub.user.dto;

public record BusinessProfileDto(
        String businessName,
        String businessType,
        String registrationNumber,
        String verificationStatus,
        boolean visibleInDirectory
) {
}
