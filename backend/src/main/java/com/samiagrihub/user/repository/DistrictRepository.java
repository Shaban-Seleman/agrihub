package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.District;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByRegionIdOrderByNameAsc(Long regionId);
}
