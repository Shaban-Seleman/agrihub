package com.samiagrihub.market.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.market.dto.DemandListingRequest;
import com.samiagrihub.market.dto.ProduceListingRequest;
import com.samiagrihub.market.entity.ListingStatus;
import com.samiagrihub.market.service.MarketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MarketController {
    private final MarketService marketService;
    private final SecurityContextService securityContextService;

    @PostMapping("/produce-listings") public ApiResponse<?> createProduce(@Valid @RequestBody ProduceListingRequest request) { return ApiResponse.success(marketService.createProduce(request, securityContextService.currentUser())); }
    @GetMapping("/me/produce-listings") public ApiResponse<?> myProduce(Pageable pageable) { return ApiResponse.success(marketService.myProduce(securityContextService.currentUser(), pageable)); }
    @GetMapping("/produce-listings/{listingId}") public ApiResponse<?> getProduce(@PathVariable Long listingId) { return ApiResponse.success(marketService.getProduce(listingId, securityContextService.currentUser())); }
    @PutMapping("/produce-listings/{listingId}") public ApiResponse<?> updateProduce(@PathVariable Long listingId, @Valid @RequestBody ProduceListingRequest request) { return ApiResponse.success(marketService.updateProduce(listingId, request, securityContextService.currentUser())); }
    @PatchMapping("/produce-listings/{listingId}/deactivate") public ApiResponse<?> deactivateProduce(@PathVariable Long listingId) { return ApiResponse.success(marketService.deactivateProduce(listingId, securityContextService.currentUser())); }
    @PostMapping("/demand-listings") public ApiResponse<?> createDemand(@Valid @RequestBody DemandListingRequest request) { return ApiResponse.success(marketService.createDemand(request, securityContextService.currentUser())); }
    @GetMapping("/me/demand-listings") public ApiResponse<?> myDemand(Pageable pageable) { return ApiResponse.success(marketService.myDemand(securityContextService.currentUser(), pageable)); }
    @GetMapping("/demand-listings/{listingId}") public ApiResponse<?> getDemand(@PathVariable Long listingId) { return ApiResponse.success(marketService.getDemand(listingId, securityContextService.currentUser())); }
    @PutMapping("/demand-listings/{listingId}") public ApiResponse<?> updateDemand(@PathVariable Long listingId, @Valid @RequestBody DemandListingRequest request) { return ApiResponse.success(marketService.updateDemand(listingId, request, securityContextService.currentUser())); }
    @PatchMapping("/demand-listings/{listingId}/deactivate") public ApiResponse<?> deactivateDemand(@PathVariable Long listingId) { return ApiResponse.success(marketService.deactivateDemand(listingId, securityContextService.currentUser())); }
    @GetMapping("/market/produce") public ApiResponse<?> browseProduce(Pageable pageable) { return ApiResponse.success(marketService.browseProduce(pageable)); }
    @GetMapping("/market/demand") public ApiResponse<?> browseDemand(Pageable pageable) { return ApiResponse.success(marketService.browseDemand(pageable)); }
    @GetMapping("/market/summary") public ApiResponse<?> summary() { return ApiResponse.success(marketService.summary()); }
}
