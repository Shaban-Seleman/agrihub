package com.samiagrihub.market.repository;

import com.samiagrihub.market.entity.DemandListing;
import com.samiagrihub.market.entity.ListingStatus;
import java.time.OffsetDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemandListingRepository extends JpaRepository<DemandListing, Long> {
    Page<DemandListing> findByUserId(Long userId, Pageable pageable);
    Page<DemandListing> findByStatusAndExpiresAtAfter(ListingStatus status, OffsetDateTime now, Pageable pageable);
    long countByStatus(ListingStatus status);
}
