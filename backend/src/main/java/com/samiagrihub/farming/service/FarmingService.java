package com.samiagrihub.farming.service;

import com.samiagrihub.common.api.PageResponse;
import com.samiagrihub.common.api.PageResponseMapper;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.farming.dto.FarmingActivityRequest;
import com.samiagrihub.farming.entity.FarmingActivity;
import com.samiagrihub.farming.entity.FarmingActivityStatus;
import com.samiagrihub.farming.repository.FarmingActivityRepository;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.repository.CropRepository;
import com.samiagrihub.user.repository.UserRepository;
import java.util.Map;
import java.util.LinkedHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FarmingService {
    private final FarmingActivityRepository farmingActivityRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final PageResponseMapper pageResponseMapper;

    @Transactional
    public Map<String, Object> create(FarmingActivityRequest request, AppUserPrincipal principal) {
        ensureFarmer(principal);
        return toMap(farmingActivityRepository.save(apply(new FarmingActivity(), request, currentUser(principal))));
    }

    public PageResponse<Map<String, Object>> myActivities(AppUserPrincipal principal, Pageable pageable) {
        ensureFarmer(principal);
        return pageResponseMapper.toPageResponse(farmingActivityRepository.findByUserId(principal.getUserId(), pageable).map(this::toMap));
    }

    public Map<String, Object> get(Long id, AppUserPrincipal principal, boolean admin) {
        FarmingActivity activity = getOwnedOrAdmin(id, principal, admin);
        return toMap(activity);
    }

    @Transactional
    public Map<String, Object> update(Long id, FarmingActivityRequest request, AppUserPrincipal principal) {
        FarmingActivity activity = getOwnedOrAdmin(id, principal, false);
        return toMap(farmingActivityRepository.save(apply(activity, request, activity.getUser())));
    }

    @Transactional
    public Map<String, Object> delete(Long id, AppUserPrincipal principal) {
        FarmingActivity activity = getOwnedOrAdmin(id, principal, false);
        activity.setStatus(FarmingActivityStatus.ARCHIVED);
        return toMap(farmingActivityRepository.save(activity));
    }

    public Map<String, Object> mySummary(AppUserPrincipal principal) {
        ensureFarmer(principal);
        var page = farmingActivityRepository.findByUserId(principal.getUserId(), Pageable.unpaged());
        long harvested = page.getContent().stream().filter(a -> a.getStatus() == FarmingActivityStatus.HARVESTED).count();
        return Map.of("totalActivities", page.getTotalElements(), "harvestedActivities", harvested);
    }

    public PageResponse<Map<String, Object>> adminList(Pageable pageable) {
        return pageResponseMapper.toPageResponse(farmingActivityRepository.findAll(pageable).map(this::toMap));
    }

    public Map<String, Object> adminSummary() {
        long total = farmingActivityRepository.count();
        long harvested = farmingActivityRepository.findAll().stream().filter(a -> a.getStatus() == FarmingActivityStatus.HARVESTED).count();
        return Map.of("totalActivities", total, "harvestedActivities", harvested);
    }

    private FarmingActivity apply(FarmingActivity target, FarmingActivityRequest request, User user) {
        if (request.harvestDate() != null && request.harvestDate().isBefore(request.plantingDate())) {
            throw new AppException("INVALID_HARVEST_DATE", "Harvest date cannot be before planting date", HttpStatus.BAD_REQUEST);
        }
        Crop crop = cropRepository.findById(request.cropId())
                .orElseThrow(() -> new AppException("CROP_NOT_FOUND", "Crop not found", HttpStatus.BAD_REQUEST));
        target.setUser(user);
        target.setCrop(crop);
        target.setSeasonCode(request.seasonCode());
        target.setLandSize(request.landSize());
        target.setLandUnit(request.landUnit());
        target.setPlantingDate(request.plantingDate());
        target.setHarvestDate(request.harvestDate());
        target.setActualYield(request.actualYield());
        target.setYieldUnit(request.yieldUnit());
        target.setFarmingMethod(request.farmingMethod());
        target.setNotes(request.notes());
        target.setStatus(request.harvestDate() != null ? FarmingActivityStatus.HARVESTED : FarmingActivityStatus.ACTIVE);
        return target;
    }

    private FarmingActivity getOwnedOrAdmin(Long id, AppUserPrincipal principal, boolean adminAllowed) {
        FarmingActivity activity = farmingActivityRepository.findById(id)
                .orElseThrow(() -> new AppException("FARMING_ACTIVITY_NOT_FOUND", "Farming activity not found", HttpStatus.NOT_FOUND));
        if (activity.getUser().getId().equals(principal.getUserId()) || (adminAllowed && principal.getAccountType() == AccountType.ADMIN)) {
            return activity;
        }
        throw new AppException("FORBIDDEN", "Access denied", HttpStatus.FORBIDDEN);
    }

    private User currentUser(AppUserPrincipal principal) {
        return userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new AppException("USER_NOT_FOUND", "User not found", HttpStatus.NOT_FOUND));
    }

    private void ensureFarmer(AppUserPrincipal principal) {
        if (principal.getAccountType() != AccountType.FARMER_YOUTH) {
            throw new AppException("FORBIDDEN", "Farmer access required", HttpStatus.FORBIDDEN);
        }
    }

    private Map<String, Object> toMap(FarmingActivity activity) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", activity.getId());
        map.put("cropId", activity.getCrop().getId());
        map.put("cropName", activity.getCrop().getName());
        map.put("seasonCode", activity.getSeasonCode());
        map.put("landSize", activity.getLandSize());
        map.put("landUnit", activity.getLandUnit());
        map.put("plantingDate", activity.getPlantingDate());
        map.put("harvestDate", activity.getHarvestDate());
        map.put("actualYield", activity.getActualYield());
        map.put("yieldUnit", activity.getYieldUnit());
        map.put("farmingMethod", activity.getFarmingMethod());
        map.put("notes", activity.getNotes());
        map.put("status", activity.getStatus().name());
        return map;
    }
}
