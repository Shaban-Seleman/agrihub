package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.FarmerProfile;
import com.samiagrihub.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, Long> {
    Optional<FarmerProfile> findByUser(User user);
    Optional<FarmerProfile> findByUserId(Long userId);
}
