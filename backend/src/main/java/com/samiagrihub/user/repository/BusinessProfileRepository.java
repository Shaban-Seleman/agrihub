package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.BusinessProfile;
import com.samiagrihub.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Long>, JpaSpecificationExecutor<BusinessProfile> {
    Optional<BusinessProfile> findByUser(User user);
}
