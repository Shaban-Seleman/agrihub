package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.PartnerProfile;
import com.samiagrihub.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerProfileRepository extends JpaRepository<PartnerProfile, Long> {
    Optional<PartnerProfile> findByUser(User user);
}
