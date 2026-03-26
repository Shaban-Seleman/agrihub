package com.samiagrihub.advisory.entity;

import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.Region;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "advisory_content")
public class AdvisoryContent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 160) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String summary;
    @Column(nullable = false, columnDefinition = "TEXT") private String content;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "crop_id") private Crop crop;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "region_id") private Region region;
    @Column(length = 255) private String mediaUrl;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private AdvisoryStatus status;
    private OffsetDateTime publishedAt;
    private OffsetDateTime archivedAt;
    @Column(nullable = false) private OffsetDateTime createdAt;
    @Column(nullable = false) private OffsetDateTime updatedAt;

    @PrePersist void prePersist() { createdAt = OffsetDateTime.now(); updatedAt = createdAt; if (status == null) status = AdvisoryStatus.DRAFT; }
    @PreUpdate void preUpdate() { updatedAt = OffsetDateTime.now(); }
}
