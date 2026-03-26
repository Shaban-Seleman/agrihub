package com.samiagrihub.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Pattern(regexp = "^\\+?[0-9]{10,15}$") String phoneNumber,
        @NotBlank @Size(min = 8, max = 72) String password
) {
}
