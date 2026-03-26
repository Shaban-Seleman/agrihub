package com.samiagrihub.user.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CropSelectionRequest(
        @NotEmpty List<@NotNull Long> cropIds
) {
}
