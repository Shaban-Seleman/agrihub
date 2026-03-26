package com.samiagrihub.market.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.market.entity.ListingStatus;
import com.samiagrihub.market.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMarketController {
    private final MarketService marketService;
    private final SecurityContextService securityContextService;

    @GetMapping("/produce-listings") public ApiResponse<?> produce(Pageable pageable) { return ApiResponse.success(marketService.adminProduce(pageable)); }
    @GetMapping("/demand-listings") public ApiResponse<?> demand(Pageable pageable) { return ApiResponse.success(marketService.adminDemand(pageable)); }
    @PatchMapping("/produce-listings/{listingId}/status") public ApiResponse<?> moderateProduce(@PathVariable Long listingId, @RequestParam ListingStatus status) { return ApiResponse.success(marketService.moderateProduce(listingId, status, securityContextService.currentUser())); }
    @PatchMapping("/demand-listings/{listingId}/status") public ApiResponse<?> moderateDemand(@PathVariable Long listingId, @RequestParam ListingStatus status) { return ApiResponse.success(marketService.moderateDemand(listingId, status, securityContextService.currentUser())); }
}
