package com.samiagrihub.opportunity.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.opportunity.entity.OpportunityStatus;
import com.samiagrihub.opportunity.service.OpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOpportunityController {
    private final OpportunityService opportunityService;
    private final SecurityContextService securityContextService;
    @GetMapping("/opportunities") public ApiResponse<?> list(Pageable pageable) { return ApiResponse.success(opportunityService.adminList(pageable, securityContextService.currentUser())); }
    @PatchMapping("/opportunities/{opportunityId}/status") public ApiResponse<?> moderate(@PathVariable Long opportunityId, @RequestParam OpportunityStatus status) { return ApiResponse.success(opportunityService.moderate(opportunityId, status, securityContextService.currentUser())); }
}
