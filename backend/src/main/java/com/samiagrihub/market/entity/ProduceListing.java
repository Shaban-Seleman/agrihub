package com.samiagrihub.market.entity;

import com.samiagrihub.farming.entity.FarmingActivity;
import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.District;
import com.samiagrihub.user.entity.Region;
import com.samiagrihub.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "produce_listings")
public class ProduceListing {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "farming_activity_id")
    private FarmingActivity farmingActivity;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;
    @Column(nullable = false, length = 160) private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal quantity;
    @Column(nullable = false, length = 20) private String unit;
    @Column(precision = 12, scale = 2) private BigDecimal pricePerUnit;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "region_id") private Region region;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "district_id") private District district;
    @Column(length = 120) private String contactName;
    @Column(nullable = false, length = 20) private String contactPhone;
    @Column(nullable = false) private OffsetDateTime expiresAt;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private ListingStatus status;
    @Column(nullable = false) private OffsetDateTime createdAt;
    @Column(nullable = false) private OffsetDateTime updatedAt;

    @PrePersist void prePersist() { createdAt = OffsetDateTime.now(); updatedAt = createdAt; if (status == null) status = ListingStatus.ACTIVE; }
    @PreUpdate void preUpdate() { updatedAt = OffsetDateTime.now(); }
}
