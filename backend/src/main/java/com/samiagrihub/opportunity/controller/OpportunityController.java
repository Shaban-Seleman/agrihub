package com.samiagrihub.opportunity.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.opportunity.dto.OpportunityRequest;
import com.samiagrihub.opportunity.entity.OpportunityStatus;
import com.samiagrihub.opportunity.service.OpportunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OpportunityController {
    private final OpportunityService opportunityService;
    private final SecurityContextService securityContextService;

    @PostMapping("/opportunities") public ApiResponse<?> create(@Valid @RequestBody OpportunityRequest request) { return ApiResponse.success(opportunityService.create(request, securityContextService.currentUser())); }
    @GetMapping("/opportunities") public ApiResponse<?> list(Pageable pageable) { return ApiResponse.success(opportunityService.list(pageable)); }
    @GetMapping("/opportunities/{opportunityId}") public ApiResponse<?> get(@PathVariable Long opportunityId) { return ApiResponse.success(opportunityService.get(opportunityId, securityContextService.currentUser())); }
    @PutMapping("/opportunities/{opportunityId}") public ApiResponse<?> update(@PathVariable Long opportunityId, @Valid @RequestBody OpportunityRequest request) { return ApiResponse.success(opportunityService.update(opportunityId, request, securityContextService.currentUser())); }
    @PatchMapping("/opportunities/{opportunityId}/deactivate") public ApiResponse<?> deactivate(@PathVariable Long opportunityId) { return ApiResponse.success(opportunityService.deactivate(opportunityId, securityContextService.currentUser())); }
    @GetMapping("/me/opportunities") public ApiResponse<?> mine(Pageable pageable) { return ApiResponse.success(opportunityService.mine(securityContextService.currentUser(), pageable)); }
    @GetMapping("/opportunities/summary") public ApiResponse<?> summary() { return ApiResponse.success(opportunityService.summary()); }
}
