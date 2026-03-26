package com.samiagrihub.user.dto;

import com.samiagrihub.user.entity.PartnerOrganizationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdatePartnerProfileRequest(
        @NotBlank @Size(max = 160) String organizationName,
        @NotNull PartnerOrganizationType organizationType,
        @Size(max = 255) String focusArea
) {
}
