package com.samiagrihub.auth.dto;

import com.samiagrihub.user.entity.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "must be a valid phone number") String phoneNumber,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotNull AccountType accountType,
        @NotBlank @Size(max = 120) String fullName
) {
}
