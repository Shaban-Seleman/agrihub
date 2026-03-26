package com.samiagrihub.farming.entity;

import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "farming_activities")
public class FarmingActivity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(nullable = false, length = 50)
    private String seasonCode;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal landSize;

    @Column(nullable = false, length = 20)
    private String landUnit;

    @Column(nullable = false)
    private LocalDate plantingDate;

    private LocalDate harvestDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal actualYield;

    @Column(length = 20)
    private String yieldUnit;

    @Column(nullable = false, length = 100)
    private String farmingMethod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FarmingActivityStatus status;

    @Column(nullable = false) private OffsetDateTime createdAt;
    @Column(nullable = false) private OffsetDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = OffsetDateTime.now();
        updatedAt = createdAt;
        if (status == null) {
            status = FarmingActivityStatus.ACTIVE;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
