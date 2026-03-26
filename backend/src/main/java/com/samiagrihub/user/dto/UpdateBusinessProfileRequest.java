package com.samiagrihub.user.dto;

import com.samiagrihub.user.entity.BusinessType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateBusinessProfileRequest(
        @NotBlank @Size(max = 160) String businessName,
        @NotNull BusinessType businessType,
        @Size(max = 50) String registrationNumber,
        boolean visibleInDirectory
) {
}
