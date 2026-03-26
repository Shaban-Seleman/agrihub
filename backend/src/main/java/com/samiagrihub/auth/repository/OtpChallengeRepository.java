package com.samiagrihub.auth.repository;

import com.samiagrihub.auth.entity.OtpChallenge;
import com.samiagrihub.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpChallengeRepository extends JpaRepository<OtpChallenge, Long> {
    Optional<OtpChallenge> findTopByUserOrderByCreatedAtDesc(User user);
}
