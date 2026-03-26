package com.samiagrihub.user.dto;

import com.samiagrihub.user.entity.AgeRange;
import com.samiagrihub.user.entity.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateUserProfileRequest(
        @NotBlank @Size(max = 120) String fullName,
        @Email @Size(max = 120) String email,
        Long regionId,
        Long districtId,
        Long wardId,
        Gender gender,
        AgeRange ageRange,
        LocalDate dateOfBirth,
        @Size(max = 255) String profilePhotoUrl
) {
}
