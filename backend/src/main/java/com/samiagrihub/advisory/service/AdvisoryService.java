package com.samiagrihub.advisory.service;

import com.samiagrihub.advisory.dto.AdvisoryRequest;
import com.samiagrihub.advisory.entity.AdvisoryContent;
import com.samiagrihub.advisory.entity.AdvisoryStatus;
import com.samiagrihub.advisory.repository.AdvisoryContentRepository;
import com.samiagrihub.common.api.PageResponse;
import com.samiagrihub.common.api.PageResponseMapper;
import com.samiagrihub.common.audit.AuditAction;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.repository.FarmerProfileRepository;
import com.samiagrihub.user.repository.CropRepository;
import com.samiagrihub.user.repository.RegionRepository;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdvisoryService {
    private final AdvisoryContentRepository advisoryContentRepository;
    private final CropRepository cropRepository;
    private final RegionRepository regionRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final PageResponseMapper pageResponseMapper;
    private final AuditService auditService;

    public PageResponse<Map<String, Object>> list(Pageable pageable) {
        return pageResponseMapper.toPageResponse(advisoryContentRepository.findByStatus(AdvisoryStatus.PUBLISHED, pageable).map(this::toMap));
    }

    public Map<String, Object> get(Long id, boolean adminView) {
        AdvisoryContent content = getEntity(id);
        if (!adminView && content.getStatus() != AdvisoryStatus.PUBLISHED) {
            throw new AppException("ADVISORY_NOT_FOUND", "Advisory not found", HttpStatus.NOT_FOUND);
        }
        return toMap(content);
    }

    public Map<String, Object> summary() {
        return Map.of("publishedAdvisoryItems", advisoryContentRepository.countByStatus(AdvisoryStatus.PUBLISHED));
    }

    public List<Map<String, Object>> recommendations(AppUserPrincipal principal) {
        Long cropId = principal.getAccountType() == AccountType.FARMER_YOUTH
                ? farmerProfileRepository.findByUserId(principal.getUserId()).map(profile -> profile.getPrimaryCrop().getId()).orElse(null)
                : null;
        return cropId == null
                ? advisoryContentRepository.findByStatus(AdvisoryStatus.PUBLISHED, Pageable.ofSize(5)).getContent().stream().map(this::toMap).toList()
                : advisoryContentRepository.findTop5ByStatusAndCropIdOrderByPublishedAtDesc(AdvisoryStatus.PUBLISHED, cropId).stream().map(this::toMap).toList();
    }

    public PageResponse<Map<String, Object>> adminList(Pageable pageable, AppUserPrincipal principal) {
        ensureAdmin(principal);
        return pageResponseMapper.toPageResponse(advisoryContentRepository.findAll(pageable).map(this::toMap));
    }

    @Transactional
    public Map<String, Object> save(AdvisoryRequest request, Long id, AppUserPrincipal principal) {
        ensureAdmin(principal);
        AdvisoryContent content = id == null ? new AdvisoryContent() : getEntity(id);
        content.setTitle(request.title());
        content.setSummary(request.summary());
        content.setContent(request.content());
        content.setCrop(request.cropId() == null ? null : cropRepository.findById(request.cropId()).orElseThrow(() -> new AppException("CROP_NOT_FOUND", "Crop not found", HttpStatus.BAD_REQUEST)));
        content.setRegion(request.regionId() == null ? null : regionRepository.findById(request.regionId()).orElseThrow(() -> new AppException("REGION_NOT_FOUND", "Region not found", HttpStatus.BAD_REQUEST)));
        content.setMediaUrl(request.mediaUrl());
        content.setStatus(request.status());
        if (request.status() == AdvisoryStatus.PUBLISHED) {
            content.setPublishedAt(OffsetDateTime.now());
        }
        AdvisoryContent saved = advisoryContentRepository.save(content);
        if (request.status() == AdvisoryStatus.PUBLISHED) {
            auditService.log(principal.getUserId(), AuditAction.ADVISORY_PUBLISHED, "ADVISORY", String.valueOf(saved.getId()), null);
        }
        return toMap(saved);
    }

    @Transactional
    public Map<String, Object> archive(Long id, AppUserPrincipal principal) {
        ensureAdmin(principal);
        AdvisoryContent content = getEntity(id);
        content.setStatus(AdvisoryStatus.ARCHIVED);
        content.setArchivedAt(OffsetDateTime.now());
        advisoryContentRepository.save(content);
        auditService.log(principal.getUserId(), AuditAction.ADVISORY_ARCHIVED, "ADVISORY", String.valueOf(id), null);
        return toMap(content);
    }

    private void ensureAdmin(AppUserPrincipal principal) { if (principal.getAccountType() != AccountType.ADMIN) throw new AppException("FORBIDDEN", "Admin access required", HttpStatus.FORBIDDEN); }
    private AdvisoryContent getEntity(Long id) { return advisoryContentRepository.findById(id).orElseThrow(() -> new AppException("ADVISORY_NOT_FOUND", "Advisory not found", HttpStatus.NOT_FOUND)); }
    private Map<String, Object> toMap(AdvisoryContent content) { Map<String, Object> map = new LinkedHashMap<>(); map.put("id", content.getId()); map.put("title", content.getTitle()); map.put("summary", content.getSummary()); map.put("content", content.getContent()); map.put("cropId", content.getCrop() == null ? null : content.getCrop().getId()); map.put("regionId", content.getRegion() == null ? null : content.getRegion().getId()); map.put("mediaUrl", content.getMediaUrl()); map.put("status", content.getStatus().name()); map.put("publishedAt", content.getPublishedAt()); return map; }
}
