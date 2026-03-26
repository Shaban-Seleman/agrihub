package com.samiagrihub.learning.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LessonFeedbackRequest(
        @NotNull Boolean helpful,
        @Size(max = 500) String comment
) {
}
