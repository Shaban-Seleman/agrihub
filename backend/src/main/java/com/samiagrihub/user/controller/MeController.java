package com.samiagrihub.user.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.user.dto.CropSelectionRequest;
import com.samiagrihub.user.dto.UpdateBusinessProfileRequest;
import com.samiagrihub.user.dto.UpdateFarmerProfileRequest;
import com.samiagrihub.user.dto.UpdatePartnerProfileRequest;
import com.samiagrihub.user.dto.UpdateUserProfileRequest;
import com.samiagrihub.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class MeController {

    private final UserService userService;
    private final SecurityContextService securityContextService;

    @GetMapping
    public ApiResponse<?> me() {
        return ApiResponse.success(userService.getMe(securityContextService.currentUser()));
    }

    @GetMapping("/profile")
    public ApiResponse<?> getProfile() {
        AppUserPrincipal principal = securityContextService.currentUser();
        Object roleProfile = switch (principal.getAccountType()) {
            case FARMER_YOUTH -> userService.getFarmerProfile(principal);
            case AGRI_SME -> userService.getBusinessProfile(principal);
            case PARTNER -> userService.getPartnerProfile(principal);
            default -> null;
        };
        java.util.Map<String, Object> response = new java.util.LinkedHashMap<>();
        response.put("sharedProfile", userService.getProfile(principal));
        response.put("roleProfile", roleProfile);
        return ApiResponse.success(response);
    }

    @PutMapping("/profile")
    public ApiResponse<?> updateProfile(@Valid @RequestBody UpdateUserProfileRequest request) {
        return ApiResponse.success(userService.updateProfile(securityContextService.currentUser(), request));
    }

    @PutMapping("/farmer-profile")
    public ApiResponse<?> updateFarmerProfile(@Valid @RequestBody UpdateFarmerProfileRequest request) {
        return ApiResponse.success(userService.updateFarmerProfile(securityContextService.currentUser(), request));
    }

    @PutMapping("/business-profile")
    public ApiResponse<?> updateBusinessProfile(@Valid @RequestBody UpdateBusinessProfileRequest request) {
        return ApiResponse.success(userService.updateBusinessProfile(securityContextService.currentUser(), request));
    }

    @PutMapping("/partner-profile")
    public ApiResponse<?> updatePartnerProfile(@Valid @RequestBody UpdatePartnerProfileRequest request) {
        return ApiResponse.success(userService.updatePartnerProfile(securityContextService.currentUser(), request));
    }

    @PostMapping("/crop-interests")
    public ApiResponse<?> saveCropInterests(@Valid @RequestBody CropSelectionRequest request) {
        return ApiResponse.success(userService.saveCropInterests(securityContextService.currentUser(), request));
    }

    @GetMapping("/crop-interests")
    public ApiResponse<?> getCropInterests() {
        return ApiResponse.success(userService.getCropInterests(securityContextService.currentUser()));
    }

    @PostMapping("/business-commodities")
    public ApiResponse<?> saveBusinessCommodities(@Valid @RequestBody CropSelectionRequest request) {
        return ApiResponse.success(userService.saveBusinessCommodities(securityContextService.currentUser(), request));
    }

    @GetMapping("/business-commodities")
    public ApiResponse<?> getBusinessCommodities() {
        return ApiResponse.success(userService.getBusinessCommodities(securityContextService.currentUser()));
    }

    @GetMapping("/profile-completion")
    public ApiResponse<?> getProfileCompletion() {
        return ApiResponse.success(userService.getProfileCompletion(securityContextService.currentUser()));
    }
}
