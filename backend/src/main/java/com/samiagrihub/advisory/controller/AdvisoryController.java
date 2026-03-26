package com.samiagrihub.advisory.controller;

import com.samiagrihub.advisory.dto.AdvisoryRequest;
import com.samiagrihub.advisory.service.AdvisoryService;
import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AdvisoryController {
    private final AdvisoryService advisoryService;
    private final SecurityContextService securityContextService;
    @GetMapping("/advisory") public ApiResponse<?> list(Pageable pageable) { return ApiResponse.success(advisoryService.list(pageable)); }
    @GetMapping("/advisory/{advisoryId}") public ApiResponse<?> get(@PathVariable Long advisoryId) { return ApiResponse.success(advisoryService.get(advisoryId, false)); }
    @GetMapping("/advisory/summary") public ApiResponse<?> summary() { return ApiResponse.success(advisoryService.summary()); }
    @GetMapping("/me/advisory-recommendations") public ApiResponse<?> recommendations() { return ApiResponse.success(advisoryService.recommendations(securityContextService.currentUser())); }
}
