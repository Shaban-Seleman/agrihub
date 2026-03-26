package com.samiagrihub.market.repository;

import com.samiagrihub.market.entity.ListingStatus;
import com.samiagrihub.market.entity.ProduceListing;
import java.time.OffsetDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduceListingRepository extends JpaRepository<ProduceListing, Long> {
    Page<ProduceListing> findByUserId(Long userId, Pageable pageable);
    Page<ProduceListing> findByStatusAndExpiresAtAfter(ListingStatus status, OffsetDateTime now, Pageable pageable);
    long countByStatus(ListingStatus status);
}
