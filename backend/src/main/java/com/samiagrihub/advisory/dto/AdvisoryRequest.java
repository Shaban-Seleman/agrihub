package com.samiagrihub.advisory.dto;

import com.samiagrihub.advisory.entity.AdvisoryStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdvisoryRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 2000) String summary,
        @NotBlank String content,
        Long cropId,
        Long regionId,
        @Size(max = 255) String mediaUrl,
        @NotNull AdvisoryStatus status
) {
}
