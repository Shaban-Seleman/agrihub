package com.samiagrihub.dashboard.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    private final SecurityContextService securityContextService;

    @GetMapping("/overview") public ApiResponse<?> overview() { return ApiResponse.success(dashboardService.overview(securityContextService.currentUser())); }
    @GetMapping("/inclusion") public ApiResponse<?> inclusion() { return ApiResponse.success(dashboardService.inclusion(securityContextService.currentUser())); }
    @GetMapping("/production") public ApiResponse<?> production() { return ApiResponse.success(dashboardService.production(securityContextService.currentUser())); }
    @GetMapping("/market") public ApiResponse<?> market() { return ApiResponse.success(dashboardService.market(securityContextService.currentUser())); }
    @GetMapping("/opportunities") public ApiResponse<?> opportunities() { return ApiResponse.success(dashboardService.opportunities(securityContextService.currentUser())); }
    @GetMapping("/smes") public ApiResponse<?> smes() { return ApiResponse.success(dashboardService.smes(securityContextService.currentUser())); }

    @GetMapping("/export/production")
    public ResponseEntity<byte[]> exportProduction() { return csv("production.csv", dashboardService.exportProduction(securityContextService.currentUser())); }
    @GetMapping("/export/users")
    public ResponseEntity<byte[]> exportUsers() { return csv("users_aggregated.csv", dashboardService.exportUsers(securityContextService.currentUser())); }
    @GetMapping("/export/market")
    public ResponseEntity<byte[]> exportMarket() { return csv("market.csv", dashboardService.exportMarket(securityContextService.currentUser())); }

    private ResponseEntity<byte[]> csv(String filename, byte[] body) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
    }
}
