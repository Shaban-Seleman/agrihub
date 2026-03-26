package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.Ward;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository extends JpaRepository<Ward, Long> {
    List<Ward> findByDistrictIdOrderByNameAsc(Long districtId);
}
