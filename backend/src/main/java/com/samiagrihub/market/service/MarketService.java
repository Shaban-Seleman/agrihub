package com.samiagrihub.market.service;

import com.samiagrihub.common.api.PageResponse;
import com.samiagrihub.common.api.PageResponseMapper;
import com.samiagrihub.common.audit.AuditAction;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.farming.entity.FarmingActivity;
import com.samiagrihub.farming.repository.FarmingActivityRepository;
import com.samiagrihub.market.dto.DemandListingRequest;
import com.samiagrihub.market.dto.ProduceListingRequest;
import com.samiagrihub.market.entity.DemandListing;
import com.samiagrihub.market.entity.ListingStatus;
import com.samiagrihub.market.entity.ProduceListing;
import com.samiagrihub.market.repository.DemandListingRepository;
import com.samiagrihub.market.repository.ProduceListingRepository;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.District;
import com.samiagrihub.user.entity.Region;
import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.repository.CropRepository;
import com.samiagrihub.user.repository.DistrictRepository;
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
public class MarketService {
    private final ProduceListingRepository produceListingRepository;
    private final DemandListingRepository demandListingRepository;
    private final FarmingActivityRepository farmingActivityRepository;
    private final CropRepository cropRepository;
    private final RegionRepository regionRepository;
    private final DistrictRepository districtRepository;
    private final UserRepository userRepository;
    private final PageResponseMapper pageResponseMapper;
    private final AuditService auditService;

    @Transactional
    public Map<String, Object> createProduce(ProduceListingRequest request, AppUserPrincipal principal) {
        ensureAccount(principal, AccountType.FARMER_YOUTH);
        ProduceListing listing = new ProduceListing();
        listing.setUser(currentUser(principal));
        applyProduce(listing, request);
        return toProduce(produceListingRepository.save(listing));
    }

    public PageResponse<Map<String, Object>> myProduce(AppUserPrincipal principal, Pageable pageable) {
        ensureAccount(principal, AccountType.FARMER_YOUTH);
        return pageResponseMapper.toPageResponse(produceListingRepository.findByUserId(principal.getUserId(), pageable).map(this::toProduce));
    }

    public Map<String, Object> getProduce(Long id, AppUserPrincipal principal) {
        ProduceListing listing = getProduceEntity(id);
        if (listing.getStatus() != ListingStatus.ACTIVE && !listing.getUser().getId().equals(principal.getUserId()) && principal.getAccountType() != AccountType.ADMIN) {
            throw new AppException("PRODUCE_NOT_AVAILABLE", "Produce listing not available", HttpStatus.NOT_FOUND);
        }
        return toProduce(listing);
    }

    @Transactional
    public Map<String, Object> updateProduce(Long id, ProduceListingRequest request, AppUserPrincipal principal) {
        ProduceListing listing = getProduceOwned(id, principal);
        applyProduce(listing, request);
        return toProduce(produceListingRepository.save(listing));
    }

    @Transactional
    public Map<String, Object> deactivateProduce(Long id, AppUserPrincipal principal) {
        ProduceListing listing = getProduceOwned(id, principal);
        listing.setStatus(ListingStatus.INACTIVE);
        return toProduce(produceListingRepository.save(listing));
    }

    @Transactional
    public Map<String, Object> createDemand(DemandListingRequest request, AppUserPrincipal principal) {
        ensureAccount(principal, AccountType.AGRI_SME);
        DemandListing listing = new DemandListing();
        listing.setUser(currentUser(principal));
        applyDemand(listing, request);
        return toDemand(demandListingRepository.save(listing));
    }

    public PageResponse<Map<String, Object>> myDemand(AppUserPrincipal principal, Pageable pageable) {
        ensureAccount(principal, AccountType.AGRI_SME);
        return pageResponseMapper.toPageResponse(demandListingRepository.findByUserId(principal.getUserId(), pageable).map(this::toDemand));
    }

    public Map<String, Object> getDemand(Long id, AppUserPrincipal principal) {
        DemandListing listing = getDemandEntity(id);
        if (listing.getStatus() != ListingStatus.ACTIVE && !listing.getUser().getId().equals(principal.getUserId()) && principal.getAccountType() != AccountType.ADMIN) {
            throw new AppException("DEMAND_NOT_AVAILABLE", "Demand listing not available", HttpStatus.NOT_FOUND);
        }
        return toDemand(listing);
    }

    @Transactional
    public Map<String, Object> updateDemand(Long id, DemandListingRequest request, AppUserPrincipal principal) {
        DemandListing listing = getDemandOwned(id, principal);
        applyDemand(listing, request);
        return toDemand(demandListingRepository.save(listing));
    }

    @Transactional
    public Map<String, Object> deactivateDemand(Long id, AppUserPrincipal principal) {
        DemandListing listing = getDemandOwned(id, principal);
        listing.setStatus(ListingStatus.INACTIVE);
        return toDemand(demandListingRepository.save(listing));
    }

    public PageResponse<Map<String, Object>> browseProduce(Pageable pageable) {
        return pageResponseMapper.toPageResponse(produceListingRepository.findByStatusAndExpiresAtAfter(ListingStatus.ACTIVE, OffsetDateTime.now(), pageable).map(this::toProduce));
    }

    public PageResponse<Map<String, Object>> browseDemand(Pageable pageable) {
        return pageResponseMapper.toPageResponse(demandListingRepository.findByStatusAndExpiresAtAfter(ListingStatus.ACTIVE, OffsetDateTime.now(), pageable).map(this::toDemand));
    }

    public Map<String, Object> summary() {
        return Map.of(
                "activeProduceListings", produceListingRepository.countByStatus(ListingStatus.ACTIVE),
                "activeDemandListings", demandListingRepository.countByStatus(ListingStatus.ACTIVE)
        );
    }

    public PageResponse<Map<String, Object>> adminProduce(Pageable pageable) {
        return pageResponseMapper.toPageResponse(produceListingRepository.findAll(pageable).map(this::toProduce));
    }

    public PageResponse<Map<String, Object>> adminDemand(Pageable pageable) {
        return pageResponseMapper.toPageResponse(demandListingRepository.findAll(pageable).map(this::toDemand));
    }

    @Transactional
    public Map<String, Object> moderateProduce(Long id, ListingStatus status, AppUserPrincipal principal) {
        ensureAccount(principal, AccountType.ADMIN);
        ProduceListing listing = getProduceEntity(id);
        listing.setStatus(status);
        produceListingRepository.save(listing);
        auditService.log(principal.getUserId(), AuditAction.PRODUCE_LISTING_MODERATED, "PRODUCE_LISTING", String.valueOf(id), status.name());
        return toProduce(listing);
    }

    @Transactional
    public Map<String, Object> moderateDemand(Long id, ListingStatus status, AppUserPrincipal principal) {
        ensureAccount(principal, AccountType.ADMIN);
        DemandListing listing = getDemandEntity(id);
        listing.setStatus(status);
        demandListingRepository.save(listing);
        auditService.log(principal.getUserId(), AuditAction.DEMAND_LISTING_MODERATED, "DEMAND_LISTING", String.valueOf(id), status.name());
        return toDemand(listing);
    }

    @Transactional
    @Scheduled(cron = "0 */30 * * * *")
    public void expireListings() {
        OffsetDateTime now = OffsetDateTime.now();
        produceListingRepository.findAll().stream()
                .filter(l -> l.getStatus() == ListingStatus.ACTIVE && l.getExpiresAt().isBefore(now))
                .forEach(l -> l.setStatus(ListingStatus.EXPIRED));
        demandListingRepository.findAll().stream()
                .filter(l -> l.getStatus() == ListingStatus.ACTIVE && l.getExpiresAt().isBefore(now))
                .forEach(l -> l.setStatus(ListingStatus.EXPIRED));
    }

    private void applyProduce(ProduceListing listing, ProduceListingRequest request) {
        validateExpiry(request.expiresAt());
        listing.setFarmingActivity(request.farmingActivityId() == null ? null : farmingActivityRepository.findById(request.farmingActivityId())
                .orElseThrow(() -> new AppException("FARMING_ACTIVITY_NOT_FOUND", "Farming activity not found", HttpStatus.BAD_REQUEST)));
        listing.setCrop(getCrop(request.cropId()));
        listing.setTitle(request.title());
        listing.setDescription(request.description());
        listing.setQuantity(request.quantity());
        listing.setUnit(request.unit());
        listing.setPricePerUnit(request.pricePerUnit());
        listing.setRegion(getRegion(request.regionId()));
        listing.setDistrict(getDistrict(request.districtId()));
        listing.setContactName(request.contactName());
        listing.setContactPhone(request.contactPhone());
        listing.setExpiresAt(request.expiresAt());
    }

    private void applyDemand(DemandListing listing, DemandListingRequest request) {
        validateExpiry(request.expiresAt());
        listing.setCrop(getCrop(request.cropId()));
        listing.setTitle(request.title());
        listing.setDescription(request.description());
        listing.setQuantity(request.quantity());
        listing.setUnit(request.unit());
        listing.setOfferedPricePerUnit(request.offeredPricePerUnit());
        listing.setRegion(getRegion(request.regionId()));
        listing.setDistrict(getDistrict(request.districtId()));
        listing.setContactName(request.contactName());
        listing.setContactPhone(request.contactPhone());
        listing.setExpiresAt(request.expiresAt());
    }

    private void validateExpiry(OffsetDateTime expiresAt) {
        if (!expiresAt.isAfter(OffsetDateTime.now())) {
            throw new AppException("INVALID_EXPIRY", "Expiry must be in the future", HttpStatus.BAD_REQUEST);
        }
    }

    private Crop getCrop(Long id) { return cropRepository.findById(id).orElseThrow(() -> new AppException("CROP_NOT_FOUND", "Crop not found", HttpStatus.BAD_REQUEST)); }
    private Region getRegion(Long id) { return id == null ? null : regionRepository.findById(id).orElseThrow(() -> new AppException("REGION_NOT_FOUND", "Region not found", HttpStatus.BAD_REQUEST)); }
    private District getDistrict(Long id) { return id == null ? null : districtRepository.findById(id).orElseThrow(() -> new AppException("DISTRICT_NOT_FOUND", "District not found", HttpStatus.BAD_REQUEST)); }
    private User currentUser(AppUserPrincipal principal) { return userRepository.findById(principal.getUserId()).orElseThrow(() -> new AppException("USER_NOT_FOUND", "User not found", HttpStatus.NOT_FOUND)); }
    private void ensureAccount(AppUserPrincipal principal, AccountType type) { if (principal.getAccountType() != type) throw new AppException("FORBIDDEN", "Access denied", HttpStatus.FORBIDDEN); }
    private ProduceListing getProduceEntity(Long id) { return produceListingRepository.findById(id).orElseThrow(() -> new AppException("PRODUCE_LISTING_NOT_FOUND", "Produce listing not found", HttpStatus.NOT_FOUND)); }
    private DemandListing getDemandEntity(Long id) { return demandListingRepository.findById(id).orElseThrow(() -> new AppException("DEMAND_LISTING_NOT_FOUND", "Demand listing not found", HttpStatus.NOT_FOUND)); }
    private ProduceListing getProduceOwned(Long id, AppUserPrincipal principal) { ProduceListing l = getProduceEntity(id); if (!l.getUser().getId().equals(principal.getUserId())) throw new AppException("FORBIDDEN", "Access denied", HttpStatus.FORBIDDEN); return l; }
    private DemandListing getDemandOwned(Long id, AppUserPrincipal principal) { DemandListing l = getDemandEntity(id); if (!l.getUser().getId().equals(principal.getUserId())) throw new AppException("FORBIDDEN", "Access denied", HttpStatus.FORBIDDEN); return l; }
    private Map<String, Object> toProduce(ProduceListing l) { Map<String, Object> map = new LinkedHashMap<>(); map.put("id", l.getId()); map.put("title", l.getTitle()); map.put("cropId", l.getCrop().getId()); map.put("cropName", l.getCrop().getName()); map.put("quantity", l.getQuantity()); map.put("unit", l.getUnit()); map.put("pricePerUnit", l.getPricePerUnit()); map.put("regionId", l.getRegion() == null ? null : l.getRegion().getId()); map.put("districtId", l.getDistrict() == null ? null : l.getDistrict().getId()); map.put("contactPhone", l.getContactPhone()); map.put("expiresAt", l.getExpiresAt()); map.put("status", l.getStatus().name()); return map; }
    private Map<String, Object> toDemand(DemandListing l) { Map<String, Object> map = new LinkedHashMap<>(); map.put("id", l.getId()); map.put("title", l.getTitle()); map.put("cropId", l.getCrop().getId()); map.put("cropName", l.getCrop().getName()); map.put("quantity", l.getQuantity()); map.put("unit", l.getUnit()); map.put("offeredPricePerUnit", l.getOfferedPricePerUnit()); map.put("regionId", l.getRegion() == null ? null : l.getRegion().getId()); map.put("districtId", l.getDistrict() == null ? null : l.getDistrict().getId()); map.put("contactPhone", l.getContactPhone()); map.put("expiresAt", l.getExpiresAt()); map.put("status", l.getStatus().name()); return map; }
}
