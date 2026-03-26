package com.samiagrihub.directory.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.directory.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDirectoryController {
    private final DirectoryService directoryService;
    private final SecurityContextService securityContextService;
    @GetMapping("/businesses") public ApiResponse<?> list(Pageable pageable) { return ApiResponse.success(directoryService.adminList(pageable, securityContextService.currentUser())); }
    @PatchMapping("/businesses/{businessProfileId}/verification") public ApiResponse<?> verify(@PathVariable Long businessProfileId, @RequestParam String status) { return ApiResponse.success(directoryService.updateVerification(businessProfileId, status, securityContextService.currentUser())); }
}
