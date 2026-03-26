package com.samiagrihub.directory.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.directory.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DirectoryController {
    private final DirectoryService directoryService;
    private final SecurityContextService securityContextService;

    @GetMapping("/directory")
    public ApiResponse<?> list(@RequestParam(required = false) String businessType,
                               @RequestParam(required = false) Long cropId,
                               @RequestParam(required = false) Long regionId,
                               @RequestParam(required = false) Long districtId,
                               @RequestParam(required = false) Boolean verifiedOnly,
                               Pageable pageable) {
        return ApiResponse.success(directoryService.list(cropId, regionId, districtId, businessType, verifiedOnly, pageable));
    }
    @GetMapping("/directory/{businessProfileId}") public ApiResponse<?> get(@PathVariable Long businessProfileId) { return ApiResponse.success(directoryService.get(businessProfileId)); }
    @GetMapping("/directory/summary") public ApiResponse<?> summary() { return ApiResponse.success(directoryService.summary()); }
}
