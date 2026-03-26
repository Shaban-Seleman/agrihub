package com.samiagrihub.opportunity.dto;

import com.samiagrihub.opportunity.entity.OpportunityType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public record OpportunityRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 2000) String summary,
        @NotNull OpportunityType opportunityType,
        Long regionId,
        Long cropId,
        @Size(max = 255) String externalApplicationLink,
        @Size(max = 255) String contactDetails,
        @NotNull @Future OffsetDateTime deadline
) {
}
