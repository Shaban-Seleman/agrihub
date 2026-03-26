package com.samiagrihub.directory.service;

import com.samiagrihub.common.api.PageResponse;
import com.samiagrihub.common.api.PageResponseMapper;
import com.samiagrihub.common.audit.AuditAction;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.BusinessProfile;
import com.samiagrihub.user.entity.BusinessProfileCommodity;
import com.samiagrihub.user.entity.BusinessType;
import com.samiagrihub.user.entity.UserProfile;
import com.samiagrihub.user.repository.BusinessProfileCommodityRepository;
import com.samiagrihub.user.repository.BusinessProfileRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DirectoryService {
    private final BusinessProfileRepository businessProfileRepository;
    private final BusinessProfileCommodityRepository businessProfileCommodityRepository;
    private final PageResponseMapper pageResponseMapper;
    private final AuditService auditService;

    public PageResponse<Map<String, Object>> list(Long cropId, Long regionId, Long districtId, String businessType, Boolean verifiedOnly, Pageable pageable) {
        Specification<BusinessProfile> spec = (root, query, cb) -> cb.isTrue(root.get("visibleInDirectory"));
        if (businessType != null) {
            BusinessType parsedType;
            try {
                parsedType = BusinessType.valueOf(businessType);
            } catch (IllegalArgumentException ex) {
                throw new AppException("INVALID_BUSINESS_TYPE", "Business type is invalid", HttpStatus.BAD_REQUEST);
            }
            spec = spec.and((root, query, cb) -> cb.equal(root.get("businessType"), parsedType));
        }
        if (verifiedOnly != null && verifiedOnly) spec = spec.and((root, query, cb) -> cb.equal(root.get("verificationStatus"), "VERIFIED"));
        if (regionId != null) {
            spec = spec.and((root, query, cb) -> {
                var sq = query.subquery(Long.class);
                var profile = sq.from(UserProfile.class);
                sq.select(profile.get("id"));
                sq.where(
                        cb.equal(profile.get("user"), root.get("user")),
                        cb.equal(profile.get("region").get("id"), regionId)
                );
                return cb.exists(sq);
            });
        }
        if (districtId != null) {
            spec = spec.and((root, query, cb) -> {
                var sq = query.subquery(Long.class);
                var profile = sq.from(UserProfile.class);
                sq.select(profile.get("id"));
                sq.where(
                        cb.equal(profile.get("user"), root.get("user")),
                        cb.equal(profile.get("district").get("id"), districtId)
                );
                return cb.exists(sq);
            });
        }
        if (cropId != null) {
            spec = spec.and((root, query, cb) -> {
                var sq = query.subquery(Long.class);
                var commodity = sq.from(BusinessProfileCommodity.class);
                sq.select(commodity.get("id"));
                sq.where(
                        cb.equal(commodity.get("businessProfile"), root),
                        cb.equal(commodity.get("crop").get("id"), cropId)
                );
                return cb.exists(sq);
            });
        }
        return pageResponseMapper.toPageResponse(businessProfileRepository.findAll(spec, pageable).map(this::toMap));
    }

    public Map<String, Object> get(Long id) {
        BusinessProfile profile = businessProfileRepository.findById(id)
                .orElseThrow(() -> new AppException("BUSINESS_NOT_FOUND", "Business profile not found", HttpStatus.NOT_FOUND));
        return toMap(profile);
    }

    public Map<String, Object> summary() {
        long total = businessProfileRepository.count();
        long verified = businessProfileRepository.findAll().stream().filter(p -> "VERIFIED".equals(p.getVerificationStatus())).count();
        return Map.of("totalBusinesses", total, "verifiedBusinesses", verified);
    }

    public PageResponse<Map<String, Object>> adminList(Pageable pageable, AppUserPrincipal principal) {
        ensureAdmin(principal);
        return pageResponseMapper.toPageResponse(businessProfileRepository.findAll(pageable).map(this::toMap));
    }

    @Transactional
    public Map<String, Object> updateVerification(Long id, String verificationStatus, AppUserPrincipal principal) {
        ensureAdmin(principal);
        BusinessProfile profile = businessProfileRepository.findById(id)
                .orElseThrow(() -> new AppException("BUSINESS_NOT_FOUND", "Business profile not found", HttpStatus.NOT_FOUND));
        profile.setVerificationStatus(verificationStatus);
        businessProfileRepository.save(profile);
        auditService.log(principal.getUserId(), AuditAction.BUSINESS_VERIFICATION_CHANGED, "BUSINESS_PROFILE", String.valueOf(id), verificationStatus);
        return toMap(profile);
    }

    private void ensureAdmin(AppUserPrincipal principal) { if (principal.getAccountType() != AccountType.ADMIN) throw new AppException("FORBIDDEN", "Admin access required", HttpStatus.FORBIDDEN); }
    private Map<String, Object> toMap(BusinessProfile profile) { Map<String, Object> map = new LinkedHashMap<>(); map.put("id", profile.getId()); map.put("businessName", profile.getBusinessName()); map.put("businessType", profile.getBusinessType().name()); map.put("registrationNumber", profile.getRegistrationNumber()); map.put("verificationStatus", profile.getVerificationStatus()); map.put("visibleInDirectory", profile.isVisibleInDirectory()); map.put("commodities", businessProfileCommodityRepository.findByBusinessProfile(profile).stream().map(c -> Map.of("cropId", c.getCrop().getId(), "cropName", c.getCrop().getName())).toList()); return map; }
}
