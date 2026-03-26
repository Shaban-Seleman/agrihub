package com.samiagrihub.learning.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CourseModuleRequest(
        @NotBlank @Size(max = 160) String title,
        String summary,
        @NotNull Integer displayOrder
) {
}
