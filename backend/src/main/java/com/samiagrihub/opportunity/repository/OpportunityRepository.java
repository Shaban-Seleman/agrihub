package com.samiagrihub.opportunity.repository;

import com.samiagrihub.opportunity.entity.Opportunity;
import com.samiagrihub.opportunity.entity.OpportunityStatus;
import java.time.OffsetDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    Page<Opportunity> findByStatusAndDeadlineAfter(OpportunityStatus status, OffsetDateTime now, Pageable pageable);
    Page<Opportunity> findByCreatedByUserId(Long userId, Pageable pageable);
    long countByStatus(OpportunityStatus status);
}
