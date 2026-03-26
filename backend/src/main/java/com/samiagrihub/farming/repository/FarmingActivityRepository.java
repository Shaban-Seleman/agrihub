package com.samiagrihub.farming.repository;

import com.samiagrihub.farming.entity.FarmingActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmingActivityRepository extends JpaRepository<FarmingActivity, Long> {
    Page<FarmingActivity> findByUserId(Long userId, Pageable pageable);
}
