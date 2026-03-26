package com.samiagrihub.advisory.controller;

import com.samiagrihub.advisory.dto.AdvisoryRequest;
import com.samiagrihub.advisory.service.AdvisoryService;
import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAdvisoryController {
    private final AdvisoryService advisoryService;
    private final SecurityContextService securityContextService;
    @PostMapping("/advisory") public ApiResponse<?> create(@Valid @RequestBody AdvisoryRequest request) { return ApiResponse.success(advisoryService.save(request, null, securityContextService.currentUser())); }
    @PutMapping("/advisory/{advisoryId}") public ApiResponse<?> update(@PathVariable Long advisoryId, @Valid @RequestBody AdvisoryRequest request) { return ApiResponse.success(advisoryService.save(request, advisoryId, securityContextService.currentUser())); }
    @GetMapping("/advisory") public ApiResponse<?> list(Pageable pageable) { return ApiResponse.success(advisoryService.adminList(pageable, securityContextService.currentUser())); }
    @PatchMapping("/advisory/{advisoryId}/archive") public ApiResponse<?> archive(@PathVariable Long advisoryId) { return ApiResponse.success(advisoryService.archive(advisoryId, securityContextService.currentUser())); }
}
