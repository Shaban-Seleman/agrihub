package com.samiagrihub.user.dto;

import java.time.LocalDate;

public record UserProfileDto(
        String fullName,
        String email,
        Long regionId,
        String regionName,
        Long districtId,
        String districtName,
        Long wardId,
        String wardName,
        String gender,
        String ageRange,
        LocalDate dateOfBirth,
        String profilePhotoUrl
) {
}
