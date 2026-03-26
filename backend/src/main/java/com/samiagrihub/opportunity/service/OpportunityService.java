package com.samiagrihub.opportunity.service;

import com.samiagrihub.common.api.PageResponse;
import com.samiagrihub.common.api.PageResponseMapper;
import com.samiagrihub.common.audit.AuditAction;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.opportunity.dto.OpportunityRequest;
import com.samiagrihub.opportunity.entity.Opportunity;
import com.samiagrihub.opportunity.entity.OpportunityStatus;
import com.samiagrihub.opportunity.repository.OpportunityRepository;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.repository.CropRepository;
import com.samiagrihub.user.repository.RegionRepository;
import com.samiagrihub.user.repository.UserRepository;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OpportunityService {
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final CropRepository cropRepository;
    private final PageResponseMapper pageResponseMapper;
    private final AuditService auditService;

    @Transactional
    public Map<String, Object> create(OpportunityRequest request, AppUserPrincipal principal) {
        ensurePoster(principal);
        Opportunity opportunity = new Opportunity();
        apply(opportunity, request, principal);
        return toMap(opportunityRepository.save(opportunity));
    }

    public PageResponse<Map<String, Object>> list(Pageable pageable) {
        return pageResponseMapper.toPageResponse(opportunityRepository.findByStatusAndDeadlineAfter(OpportunityStatus.ACTIVE, OffsetDateTime.now(), pageable).map(this::toMap));
    }

    public Map<String, Object> get(Long id, AppUserPrincipal principal) {
        Opportunity o = getEntity(id);
        if (o.getStatus() != OpportunityStatus.ACTIVE && (principal == null || (!o.getCreatedByUser().getId().equals(principal.getUserId()) && principal.getAccountType() != AccountType.ADMIN))) {
            throw new AppException("OPPORTUNITY_NOT_AVAILABLE", "Opportunity not available", HttpStatus.NOT_FOUND);
        }
        return toMap(o);
    }

    @Transactional
    public Map<String, Object> update(Long id, OpportunityRequest request, AppUserPrincipal principal) {
        Opportunity o = getOwnedOrAdmin(id, principal);
        apply(o, request, principal);
        return toMap(opportunityRepository.save(o));
    }

    @Transactional
    public Map<String, Object> deactivate(Long id, AppUserPrincipal principal) {
        Opportunity o = getOwnedOrAdmin(id, principal);
        o.setStatus(OpportunityStatus.INACTIVE);
        return toMap(opportunityRepository.save(o));
    }

    public PageResponse<Map<String, Object>> mine(AppUserPrincipal principal, Pageable pageable) {
        ensurePoster(principal);
        return pageResponseMapper.toPageResponse(opportunityRepository.findByCreatedByUserId(principal.getUserId(), pageable).map(this::toMap));
    }

    public Map<String, Object> summary() {
        return Map.of("activeOpportunities", opportunityRepository.countByStatus(OpportunityStatus.ACTIVE));
    }

    public PageResponse<Map<String, Object>> adminList(Pageable pageable, AppUserPrincipal principal) {
        ensureAdmin(principal);
        return pageResponseMapper.toPageResponse(opportunityRepository.findAll(pageable).map(this::toMap));
    }

    @Transactional
    public Map<String, Object> moderate(Long id, OpportunityStatus status, AppUserPrincipal principal) {
        ensureAdmin(principal);
        Opportunity o = getEntity(id);
        o.setStatus(status);
        opportunityRepository.save(o);
        auditService.log(principal.getUserId(), AuditAction.OPPORTUNITY_MODERATED, "OPPORTUNITY", String.valueOf(id), status.name());
        return toMap(o);
    }

    @Transactional
    @Scheduled(cron = "0 */30 * * * *")
    public void expireOpportunities() {
        OffsetDateTime now = OffsetDateTime.now();
        opportunityRepository.findAll().stream()
                .filter(o -> o.getStatus() == OpportunityStatus.ACTIVE && o.getDeadline().isBefore(now))
                .forEach(o -> o.setStatus(OpportunityStatus.EXPIRED));
    }

    private void apply(Opportunity o, OpportunityRequest request, AppUserPrincipal principal) {
        if ((request.externalApplicationLink() == null || request.externalApplicationLink().isBlank())
                && (request.contactDetails() == null || request.contactDetails().isBlank())) {
            throw new AppException("APPLICATION_CHANNEL_REQUIRED", "Provide an external application link or contact details", HttpStatus.BAD_REQUEST);
        }
        o.setCreatedByUser(userRepository.findById(principal.getUserId()).orElseThrow());
        o.setTitle(request.title());
        o.setSummary(request.summary());
        o.setOpportunityType(request.opportunityType());
        o.setRegion(request.regionId() == null ? null : regionRepository.findById(request.regionId()).orElseThrow(() -> new AppException("REGION_NOT_FOUND", "Region not found", HttpStatus.BAD_REQUEST)));
        o.setCrop(request.cropId() == null ? null : cropRepository.findById(request.cropId()).orElseThrow(() -> new AppException("CROP_NOT_FOUND", "Crop not found", HttpStatus.BAD_REQUEST)));
        o.setExternalApplicationLink(request.externalApplicationLink());
        o.setContactDetails(request.contactDetails());
        o.setDeadline(request.deadline());
    }

    private Opportunity getEntity(Long id) { return opportunityRepository.findById(id).orElseThrow(() -> new AppException("OPPORTUNITY_NOT_FOUND", "Opportunity not found", HttpStatus.NOT_FOUND)); }
    private Opportunity getOwnedOrAdmin(Long id, AppUserPrincipal principal) { Opportunity o = getEntity(id); if (!o.getCreatedByUser().getId().equals(principal.getUserId()) && principal.getAccountType() != AccountType.ADMIN) throw new AppException("FORBIDDEN", "Access denied", HttpStatus.FORBIDDEN); return o; }
    private void ensurePoster(AppUserPrincipal principal) { if (principal.getAccountType() != AccountType.AGRI_SME && principal.getAccountType() != AccountType.PARTNER && principal.getAccountType() != AccountType.ADMIN) throw new AppException("FORBIDDEN", "Access denied", HttpStatus.FORBIDDEN); }
    private void ensureAdmin(AppUserPrincipal principal) { if (principal.getAccountType() != AccountType.ADMIN) throw new AppException("FORBIDDEN", "Admin access required", HttpStatus.FORBIDDEN); }
    private Map<String, Object> toMap(Opportunity o) { Map<String, Object> map = new LinkedHashMap<>(); map.put("id", o.getId()); map.put("title", o.getTitle()); map.put("summary", o.getSummary()); map.put("opportunityType", o.getOpportunityType().name()); map.put("regionId", o.getRegion() == null ? null : o.getRegion().getId()); map.put("cropId", o.getCrop() == null ? null : o.getCrop().getId()); map.put("externalApplicationLink", o.getExternalApplicationLink()); map.put("contactDetails", o.getContactDetails()); map.put("deadline", o.getDeadline()); map.put("status", o.getStatus().name()); return map; }
}
