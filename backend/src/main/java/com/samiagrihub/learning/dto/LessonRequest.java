package com.samiagrihub.learning.dto;

import com.samiagrihub.learning.entity.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LessonRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank String content,
        @Size(max = 255) String mediaUrl,
        Integer durationMinutes,
        @NotNull Integer displayOrder,
        @NotNull ContentStatus status
) {
}
