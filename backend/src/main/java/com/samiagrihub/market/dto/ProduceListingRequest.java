package com.samiagrihub.market.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ProduceListingRequest(
        Long farmingActivityId,
        @NotNull Long cropId,
        @NotBlank @Size(max = 160) String title,
        @Size(max = 2000) String description,
        @NotNull @DecimalMin("0.01") BigDecimal quantity,
        @NotBlank @Size(max = 20) String unit,
        @DecimalMin("0.0") BigDecimal pricePerUnit,
        Long regionId,
        Long districtId,
        @Size(max = 120) String contactName,
        @NotBlank @Pattern(regexp = "^\\+?[0-9]{10,15}$") String contactPhone,
        @NotNull OffsetDateTime expiresAt
) {
}
