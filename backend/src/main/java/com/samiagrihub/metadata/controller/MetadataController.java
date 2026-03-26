package com.samiagrihub.metadata.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.metadata.service.MetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/metadata")
@RequiredArgsConstructor
public class MetadataController {

    private final MetadataService metadataService;

    @GetMapping("/account-types")
    public ApiResponse<?> accountTypes() {
        return ApiResponse.success(metadataService.getAccountTypes());
    }

    @GetMapping("/crops")
    public ApiResponse<?> crops() {
        return ApiResponse.success(metadataService.getCrops());
    }

    @GetMapping("/regions")
    public ApiResponse<?> regions() {
        return ApiResponse.success(metadataService.getRegions());
    }

    @GetMapping("/districts")
    public ApiResponse<?> districts(@RequestParam Long regionId) {
        return ApiResponse.success(metadataService.getDistricts(regionId));
    }

    @GetMapping("/wards")
    public ApiResponse<?> wards(@RequestParam Long districtId) {
        return ApiResponse.success(metadataService.getWards(districtId));
    }
}
