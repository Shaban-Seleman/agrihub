package com.samiagrihub.farming.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FarmingActivityRequest(
        @NotNull Long cropId,
        @NotBlank @Size(max = 50) String seasonCode,
        @NotNull @DecimalMin("0.01") BigDecimal landSize,
        @NotBlank @Size(max = 20) String landUnit,
        @NotNull LocalDate plantingDate,
        LocalDate harvestDate,
        @DecimalMin("0.0") BigDecimal actualYield,
        @Size(max = 20) String yieldUnit,
        @NotBlank @Size(max = 100) String farmingMethod,
        @Size(max = 1000) String notes
) {
}
