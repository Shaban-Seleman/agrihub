package com.samiagrihub.learning.dto;

import com.samiagrihub.learning.entity.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CourseRequest(
        @NotBlank @Size(max = 160) String title,
        String summary,
        @Size(max = 255) String coverImageUrl,
        @NotNull ContentStatus status
) {
}
