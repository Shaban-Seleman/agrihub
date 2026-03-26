package com.samiagrihub.metadata.service;

import com.samiagrihub.metadata.dto.AccountTypeDto;
import com.samiagrihub.metadata.dto.LookupDto;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.repository.CropRepository;
import com.samiagrihub.user.repository.DistrictRepository;
import com.samiagrihub.user.repository.RegionRepository;
import com.samiagrihub.user.repository.WardRepository;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MetadataService {

    private final CropRepository cropRepository;
    private final RegionRepository regionRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    public List<AccountTypeDto> getAccountTypes() {
        return Arrays.stream(AccountType.values())
                .filter(type -> type != AccountType.ADMIN && type != AccountType.DONOR_VIEWER)
                .map(type -> new AccountTypeDto(type.name(), type.name().replace('_', ' ')))
                .toList();
    }

    public List<LookupDto> getCrops() {
        return cropRepository.findAll().stream().map(crop -> new LookupDto(crop.getId(), crop.getName())).toList();
    }

    public List<LookupDto> getRegions() {
        return regionRepository.findAll().stream().map(region -> new LookupDto(region.getId(), region.getName())).toList();
    }

    public List<LookupDto> getDistricts(Long regionId) {
        return districtRepository.findByRegionIdOrderByNameAsc(regionId).stream()
                .map(district -> new LookupDto(district.getId(), district.getName()))
                .toList();
    }

    public List<LookupDto> getWards(Long districtId) {
        return wardRepository.findByDistrictIdOrderByNameAsc(districtId).stream()
                .map(ward -> new LookupDto(ward.getId(), ward.getName()))
                .toList();
    }
}
