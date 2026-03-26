package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.BusinessProfile;
import com.samiagrihub.user.entity.BusinessProfileCommodity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessProfileCommodityRepository extends JpaRepository<BusinessProfileCommodity, Long> {
    List<BusinessProfileCommodity> findByBusinessProfile(BusinessProfile businessProfile);
    void deleteByBusinessProfile(BusinessProfile businessProfile);
}
