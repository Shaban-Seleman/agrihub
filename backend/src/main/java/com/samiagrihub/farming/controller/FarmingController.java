package com.samiagrihub.farming.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.farming.dto.FarmingActivityRequest;
import com.samiagrihub.farming.service.FarmingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FarmingController {
    private final FarmingService farmingService;
    private final SecurityContextService securityContextService;

    @PostMapping("/farming-activities")
    public ApiResponse<?> create(@Valid @RequestBody FarmingActivityRequest request) { return ApiResponse.success(farmingService.create(request, securityContextService.currentUser())); }
    @GetMapping("/me/farming-activities")
    public ApiResponse<?> mine(Pageable pageable) { return ApiResponse.success(farmingService.myActivities(securityContextService.currentUser(), pageable)); }
    @GetMapping("/farming-activities/{activityId}")
    public ApiResponse<?> get(@PathVariable Long activityId) { return ApiResponse.success(farmingService.get(activityId, securityContextService.currentUser(), true)); }
    @PutMapping("/farming-activities/{activityId}")
    public ApiResponse<?> update(@PathVariable Long activityId, @Valid @RequestBody FarmingActivityRequest request) { return ApiResponse.success(farmingService.update(activityId, request, securityContextService.currentUser())); }
    @DeleteMapping("/farming-activities/{activityId}")
    public ApiResponse<?> delete(@PathVariable Long activityId) { return ApiResponse.success(farmingService.delete(activityId, securityContextService.currentUser())); }
    @GetMapping("/me/farming-summary")
    public ApiResponse<?> summary() { return ApiResponse.success(farmingService.mySummary(securityContextService.currentUser())); }
}
