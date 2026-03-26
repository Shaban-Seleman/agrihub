package com.samiagrihub.user.mapper;

import com.samiagrihub.user.dto.UserProfileDto;
import com.samiagrihub.user.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    @Mapping(target = "regionId", source = "region.id")
    @Mapping(target = "regionName", source = "region.name")
    @Mapping(target = "districtId", source = "district.id")
    @Mapping(target = "districtName", source = "district.name")
    @Mapping(target = "wardId", source = "ward.id")
    @Mapping(target = "wardName", source = "ward.name")
    @Mapping(target = "gender", source = "gender")
    @Mapping(target = "ageRange", source = "ageRange")
    UserProfileDto toDto(UserProfile userProfile);
}
