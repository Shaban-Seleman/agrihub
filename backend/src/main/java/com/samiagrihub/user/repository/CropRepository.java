package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropRepository extends JpaRepository<Crop, Long> {
}
