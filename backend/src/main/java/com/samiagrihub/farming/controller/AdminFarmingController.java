package com.samiagrihub.farming.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.farming.service.FarmingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/farming-activities")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFarmingController {
    private final FarmingService farmingService;
    @GetMapping public ApiResponse<?> list(Pageable pageable) { return ApiResponse.success(farmingService.adminList(pageable)); }
    @GetMapping("/summary") public ApiResponse<?> summary() { return ApiResponse.success(farmingService.adminSummary()); }
}
