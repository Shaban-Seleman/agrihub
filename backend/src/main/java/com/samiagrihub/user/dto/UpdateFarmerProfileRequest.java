package com.samiagrihub.user.dto;

import com.samiagrihub.user.entity.AgeRange;
import com.samiagrihub.user.entity.Gender;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateFarmerProfileRequest(
        @NotNull Gender gender,
        @NotNull AgeRange ageRange,
        @NotNull Long primaryCropId,
        Long secondaryCropId,
        @Size(max = 255) String farmingExperience
) {
}
