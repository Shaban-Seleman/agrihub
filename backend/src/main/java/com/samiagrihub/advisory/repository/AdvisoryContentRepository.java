package com.samiagrihub.advisory.repository;

import com.samiagrihub.advisory.entity.AdvisoryContent;
import com.samiagrihub.advisory.entity.AdvisoryStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdvisoryContentRepository extends JpaRepository<AdvisoryContent, Long> {
    Page<AdvisoryContent> findByStatus(AdvisoryStatus status, Pageable pageable);
    List<AdvisoryContent> findTop5ByStatusAndCropIdOrderByPublishedAtDesc(AdvisoryStatus status, Long cropId);
    long countByStatus(AdvisoryStatus status);
}
