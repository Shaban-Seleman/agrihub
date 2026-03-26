package com.samiagrihub.user.dto;

public record FarmerProfileDto(
        String gender,
        String ageRange,
        Long primaryCropId,
        String primaryCropName,
        Long secondaryCropId,
        String secondaryCropName,
        String farmingExperience
) {
}
