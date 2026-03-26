package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.entity.UserProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser(User user);
}
