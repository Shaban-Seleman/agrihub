package com.samiagrihub.opportunity.entity;

import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.Region;
import com.samiagrihub.user.entity.User;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "opportunities")
public class Opportunity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;
    @Column(nullable = false, length = 160) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String summary;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 40) private OpportunityType opportunityType;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "region_id") private Region region;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "crop_id") private Crop crop;
    @Column(length = 255) private String externalApplicationLink;
    @Column(length = 255) private String contactDetails;
    @Column(nullable = false) private OffsetDateTime deadline;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private OpportunityStatus status;
    @Column(nullable = false) private OffsetDateTime createdAt;
    @Column(nullable = false) private OffsetDateTime updatedAt;

    @PrePersist void prePersist() { createdAt = OffsetDateTime.now(); updatedAt = createdAt; if (status == null) status = OpportunityStatus.ACTIVE; }
    @PreUpdate void preUpdate() { updatedAt = OffsetDateTime.now(); }
}
