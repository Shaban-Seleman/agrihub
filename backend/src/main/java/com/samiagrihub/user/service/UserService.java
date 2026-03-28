package com.samiagrihub.user.service;

import com.samiagrihub.common.audit.AuditAction;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.user.dto.BusinessProfileDto;
import com.samiagrihub.user.dto.ChangePasswordRequest;
import com.samiagrihub.user.dto.CropOptionDto;
import com.samiagrihub.user.dto.CropSelectionRequest;
import com.samiagrihub.user.dto.FarmerProfileDto;
import com.samiagrihub.user.dto.MeResponse;
import com.samiagrihub.user.dto.PartnerProfileDto;
import com.samiagrihub.user.dto.ProfileCompletionResponse;
import com.samiagrihub.user.dto.UpdateBusinessProfileRequest;
import com.samiagrihub.user.dto.UpdateFarmerProfileRequest;
import com.samiagrihub.user.dto.UpdatePartnerProfileRequest;
import com.samiagrihub.user.dto.UpdateUserProfileRequest;
import com.samiagrihub.user.dto.UserProfileDto;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.BusinessProfile;
import com.samiagrihub.user.entity.BusinessProfileCommodity;
import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.FarmerProfile;
import com.samiagrihub.user.entity.PartnerProfile;
import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.entity.UserCropInterest;
import com.samiagrihub.user.entity.UserProfile;
import com.samiagrihub.user.mapper.UserProfileMapper;
import com.samiagrihub.user.repository.BusinessProfileCommodityRepository;
import com.samiagrihub.user.repository.BusinessProfileRepository;
import com.samiagrihub.user.repository.CropRepository;
import com.samiagrihub.user.repository.DistrictRepository;
import com.samiagrihub.user.repository.FarmerProfileRepository;
import com.samiagrihub.user.repository.PartnerProfileRepository;
import com.samiagrihub.user.repository.RegionRepository;
import com.samiagrihub.user.repository.UserCropInterestRepository;
import com.samiagrihub.user.repository.UserProfileRepository;
import com.samiagrihub.user.repository.UserRepository;
import com.samiagrihub.user.repository.WardRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final PartnerProfileRepository partnerProfileRepository;
    private final CropRepository cropRepository;
    private final RegionRepository regionRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final UserCropInterestRepository userCropInterestRepository;
    private final BusinessProfileCommodityRepository businessProfileCommodityRepository;
    private final UserProfileMapper userProfileMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public MeResponse getMe(AppUserPrincipal principal) {
        User user = currentUser(principal);
        return new MeResponse(user.getId(), user.getPhoneNumber(), user.getAccountType().name(), user.getStatus().name());
    }

    public UserProfileDto getProfile(AppUserPrincipal principal) {
        return userProfileMapper.toDto(loadUserProfile(currentUser(principal)));
    }

    @Transactional
    public UserProfileDto updateProfile(AppUserPrincipal principal, UpdateUserProfileRequest request) {
        UserProfile profile = loadUserProfile(currentUser(principal));
        profile.setFullName(request.fullName());
        profile.setEmail(request.email());
        profile.setRegion(request.regionId() == null ? null : regionRepository.findById(request.regionId())
                .orElseThrow(() -> new AppException("REGION_NOT_FOUND", "Region not found", HttpStatus.BAD_REQUEST)));
        profile.setDistrict(request.districtId() == null ? null : districtRepository.findById(request.districtId())
                .orElseThrow(() -> new AppException("DISTRICT_NOT_FOUND", "District not found", HttpStatus.BAD_REQUEST)));
        profile.setWard(request.wardId() == null ? null : wardRepository.findById(request.wardId())
                .orElseThrow(() -> new AppException("WARD_NOT_FOUND", "Ward not found", HttpStatus.BAD_REQUEST)));
        profile.setGender(request.gender());
        profile.setAgeRange(request.ageRange());
        profile.setDateOfBirth(request.dateOfBirth());
        profile.setProfilePhotoUrl(request.profilePhotoUrl());
        return userProfileMapper.toDto(userProfileRepository.save(profile));
    }

    public FarmerProfileDto getFarmerProfile(AppUserPrincipal principal) {
        ensureAccountType(principal, AccountType.FARMER_YOUTH);
        FarmerProfile farmerProfile = farmerProfileRepository.findByUser(currentUser(principal))
                .orElse(null);
        return farmerProfile == null ? null : new FarmerProfileDto(
                farmerProfile.getGender().name(),
                farmerProfile.getAgeRange().name(),
                farmerProfile.getPrimaryCrop().getId(),
                farmerProfile.getPrimaryCrop().getName(),
                farmerProfile.getSecondaryCrop() == null ? null : farmerProfile.getSecondaryCrop().getId(),
                farmerProfile.getSecondaryCrop() == null ? null : farmerProfile.getSecondaryCrop().getName(),
                farmerProfile.getFarmingExperience());
    }

    @Transactional
    public FarmerProfileDto updateFarmerProfile(AppUserPrincipal principal, UpdateFarmerProfileRequest request) {
        ensureAccountType(principal, AccountType.FARMER_YOUTH);
        if (request.secondaryCropId() != null && request.secondaryCropId().equals(request.primaryCropId())) {
            throw new AppException("INVALID_CROP_SELECTION", "Secondary crop cannot be the same as primary crop", HttpStatus.BAD_REQUEST);
        }
        User user = currentUser(principal);
        Crop primaryCrop = getCrop(request.primaryCropId());
        Crop secondaryCrop = request.secondaryCropId() == null ? null : getCrop(request.secondaryCropId());
        FarmerProfile farmerProfile = farmerProfileRepository.findByUser(user).orElse(FarmerProfile.builder().user(user).build());
        farmerProfile.setGender(request.gender());
        farmerProfile.setAgeRange(request.ageRange());
        farmerProfile.setPrimaryCrop(primaryCrop);
        farmerProfile.setSecondaryCrop(secondaryCrop);
        farmerProfile.setFarmingExperience(request.farmingExperience());
        UserProfile profile = loadUserProfile(user);
        profile.setGender(request.gender());
        profile.setAgeRange(request.ageRange());
        userProfileRepository.save(profile);
        FarmerProfile saved = farmerProfileRepository.save(farmerProfile);
        return new FarmerProfileDto(saved.getGender().name(), saved.getAgeRange().name(), saved.getPrimaryCrop().getId(),
                saved.getPrimaryCrop().getName(), saved.getSecondaryCrop() == null ? null : saved.getSecondaryCrop().getId(),
                saved.getSecondaryCrop() == null ? null : saved.getSecondaryCrop().getName(), saved.getFarmingExperience());
    }

    public BusinessProfileDto getBusinessProfile(AppUserPrincipal principal) {
        ensureAccountType(principal, AccountType.AGRI_SME);
        BusinessProfile businessProfile = businessProfileRepository.findByUser(currentUser(principal)).orElse(null);
        return businessProfile == null ? null : new BusinessProfileDto(
                businessProfile.getBusinessName(),
                businessProfile.getBusinessType().name(),
                businessProfile.getRegistrationNumber(),
                businessProfile.getVerificationStatus(),
                businessProfile.isVisibleInDirectory());
    }

    @Transactional
    public BusinessProfileDto updateBusinessProfile(AppUserPrincipal principal, UpdateBusinessProfileRequest request) {
        ensureAccountType(principal, AccountType.AGRI_SME);
        User user = currentUser(principal);
        BusinessProfile businessProfile = businessProfileRepository.findByUser(user).orElse(BusinessProfile.builder().user(user).build());
        businessProfile.setBusinessName(request.businessName());
        businessProfile.setBusinessType(request.businessType());
        businessProfile.setRegistrationNumber(request.registrationNumber());
        businessProfile.setVisibleInDirectory(request.visibleInDirectory());
        BusinessProfile saved = businessProfileRepository.save(businessProfile);
        return new BusinessProfileDto(saved.getBusinessName(), saved.getBusinessType().name(), saved.getRegistrationNumber(),
                saved.getVerificationStatus(), saved.isVisibleInDirectory());
    }

    public PartnerProfileDto getPartnerProfile(AppUserPrincipal principal) {
        ensureAccountType(principal, AccountType.PARTNER);
        PartnerProfile partnerProfile = partnerProfileRepository.findByUser(currentUser(principal)).orElse(null);
        return partnerProfile == null ? null : new PartnerProfileDto(
                partnerProfile.getOrganizationName(),
                partnerProfile.getOrganizationType().name(),
                partnerProfile.getFocusArea());
    }

    @Transactional
    public PartnerProfileDto updatePartnerProfile(AppUserPrincipal principal, UpdatePartnerProfileRequest request) {
        ensureAccountType(principal, AccountType.PARTNER);
        User user = currentUser(principal);
        PartnerProfile partnerProfile = partnerProfileRepository.findByUser(user).orElse(PartnerProfile.builder().user(user).build());
        partnerProfile.setOrganizationName(request.organizationName());
        partnerProfile.setOrganizationType(request.organizationType());
        partnerProfile.setFocusArea(request.focusArea());
        PartnerProfile saved = partnerProfileRepository.save(partnerProfile);
        return new PartnerProfileDto(saved.getOrganizationName(), saved.getOrganizationType().name(), saved.getFocusArea());
    }

    @Transactional
    public List<CropOptionDto> saveCropInterests(AppUserPrincipal principal, CropSelectionRequest request) {
        User user = currentUser(principal);
        userCropInterestRepository.deleteByUser(user);
        List<Crop> crops = cropRepository.findAllById(request.cropIds());
        if (crops.size() != request.cropIds().size()) {
            throw new AppException("CROP_NOT_FOUND", "One or more crops were not found", HttpStatus.BAD_REQUEST);
        }
        crops.forEach(crop -> userCropInterestRepository.save(UserCropInterest.builder().user(user).crop(crop).build()));
        return crops.stream().map(crop -> new CropOptionDto(crop.getId(), crop.getName())).toList();
    }

    public List<CropOptionDto> getCropInterests(AppUserPrincipal principal) {
        return userCropInterestRepository.findByUser(currentUser(principal)).stream()
                .map(entry -> new CropOptionDto(entry.getCrop().getId(), entry.getCrop().getName()))
                .toList();
    }

    @Transactional
    public List<CropOptionDto> saveBusinessCommodities(AppUserPrincipal principal, CropSelectionRequest request) {
        ensureAccountType(principal, AccountType.AGRI_SME);
        User user = currentUser(principal);
        BusinessProfile businessProfile = businessProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("BUSINESS_PROFILE_REQUIRED", "Complete business profile first", HttpStatus.BAD_REQUEST));
        businessProfileCommodityRepository.deleteByBusinessProfile(businessProfile);
        List<Crop> crops = cropRepository.findAllById(request.cropIds());
        if (crops.size() != request.cropIds().size()) {
            throw new AppException("CROP_NOT_FOUND", "One or more crops were not found", HttpStatus.BAD_REQUEST);
        }
        crops.forEach(crop -> businessProfileCommodityRepository.save(BusinessProfileCommodity.builder()
                .businessProfile(businessProfile)
                .crop(crop)
                .build()));
        return crops.stream().map(crop -> new CropOptionDto(crop.getId(), crop.getName())).toList();
    }

    public List<CropOptionDto> getBusinessCommodities(AppUserPrincipal principal) {
        ensureAccountType(principal, AccountType.AGRI_SME);
        BusinessProfile businessProfile = businessProfileRepository.findByUser(currentUser(principal))
                .orElseThrow(() -> new AppException("BUSINESS_PROFILE_REQUIRED", "Complete business profile first", HttpStatus.BAD_REQUEST));
        return businessProfileCommodityRepository.findByBusinessProfile(businessProfile).stream()
                .map(entry -> new CropOptionDto(entry.getCrop().getId(), entry.getCrop().getName()))
                .toList();
    }

    public ProfileCompletionResponse getProfileCompletion(AppUserPrincipal principal) {
        User user = currentUser(principal);
        boolean sharedProfileComplete = userProfileRepository.findByUser(user)
                .map(profile -> profile.getFullName() != null && profile.getRegion() != null && profile.getDistrict() != null)
                .orElse(false);
        boolean roleProfileComplete = switch (user.getAccountType()) {
            case FARMER_YOUTH -> farmerProfileRepository.findByUser(user).isPresent();
            case AGRI_SME -> businessProfileRepository.findByUser(user).isPresent();
            case PARTNER -> partnerProfileRepository.findByUser(user).isPresent();
            default -> true;
        };
        boolean cropSelectionsComplete = switch (user.getAccountType()) {
            case FARMER_YOUTH -> !userCropInterestRepository.findByUser(user).isEmpty();
            case AGRI_SME -> businessProfileRepository.findByUser(user)
                    .map(businessProfile -> !businessProfileCommodityRepository.findByBusinessProfile(businessProfile).isEmpty())
                    .orElse(false);
            default -> true;
        };
        int completed = (sharedProfileComplete ? 1 : 0) + (roleProfileComplete ? 1 : 0) + (cropSelectionsComplete ? 1 : 0);
        return new ProfileCompletionResponse(completed * 100 / 3, sharedProfileComplete, roleProfileComplete, cropSelectionsComplete);
    }

    @Transactional
    public void changePassword(AppUserPrincipal principal, ChangePasswordRequest request) {
        User user = currentUser(principal);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new AppException("INVALID_CURRENT_PASSWORD", "Current password is incorrect", HttpStatus.BAD_REQUEST);
        }
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new AppException("PASSWORD_CONFIRMATION_MISMATCH", "New password confirmation does not match", HttpStatus.BAD_REQUEST);
        }
        if (request.currentPassword().equals(request.newPassword())) {
            throw new AppException("PASSWORD_UNCHANGED", "New password must be different from the current password", HttpStatus.BAD_REQUEST);
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        auditService.log(user.getId(), AuditAction.PASSWORD_CHANGED, "USER", String.valueOf(user.getId()), null);
    }

    private User currentUser(AppUserPrincipal principal) {
        return userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new AppException("USER_NOT_FOUND", "User was not found", HttpStatus.NOT_FOUND));
    }

    private UserProfile loadUserProfile(User user) {
        return userProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("PROFILE_NOT_FOUND", "User profile was not found", HttpStatus.NOT_FOUND));
    }

    private Crop getCrop(Long cropId) {
        return cropRepository.findById(cropId)
                .orElseThrow(() -> new AppException("CROP_NOT_FOUND", "Crop not found", HttpStatus.BAD_REQUEST));
    }

    private void ensureAccountType(AppUserPrincipal principal, AccountType accountType) {
        if (principal.getAccountType() != accountType) {
            throw new AppException("ACCOUNT_TYPE_MISMATCH", "This action is not allowed for your account type", HttpStatus.FORBIDDEN);
        }
    }
}
