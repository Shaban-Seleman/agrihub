package com.samiagrihub.dashboard.service;

import com.samiagrihub.advisory.repository.AdvisoryContentRepository;
import com.samiagrihub.advisory.entity.AdvisoryStatus;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.farming.entity.FarmingActivityStatus;
import com.samiagrihub.farming.repository.FarmingActivityRepository;
import com.samiagrihub.market.entity.ListingStatus;
import com.samiagrihub.market.repository.DemandListingRepository;
import com.samiagrihub.market.repository.ProduceListingRepository;
import com.samiagrihub.opportunity.entity.OpportunityStatus;
import com.samiagrihub.opportunity.repository.OpportunityRepository;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.AgeRange;
import com.samiagrihub.user.entity.Gender;
import com.samiagrihub.user.repository.BusinessProfileRepository;
import com.samiagrihub.user.repository.UserProfileRepository;
import com.samiagrihub.user.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {
    private final UserRepository userRepository;
    private final FarmingActivityRepository farmingActivityRepository;
    private final ProduceListingRepository produceListingRepository;
    private final DemandListingRepository demandListingRepository;
    private final OpportunityRepository opportunityRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final AdvisoryContentRepository advisoryContentRepository;
    private final UserProfileRepository userProfileRepository;

    public Map<String, Object> overview(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        return Map.of(
                "totalUsers", userRepository.count(),
                "activeProduceListings", produceListingRepository.countByStatus(ListingStatus.ACTIVE),
                "activeDemandListings", demandListingRepository.countByStatus(ListingStatus.ACTIVE),
                "activeOpportunities", opportunityRepository.countByStatus(OpportunityStatus.ACTIVE),
                "publishedAdvisory", advisoryContentRepository.countByStatus(AdvisoryStatus.PUBLISHED)
        );
    }

    public Map<String, Object> inclusion(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        var profiles = userProfileRepository.findAll();
        long womenParticipation = profiles.stream()
                .filter(profile -> profile.getGender() == Gender.FEMALE)
                .count();
        long youthParticipation = profiles.stream()
                .filter(profile -> profile.getAgeRange() == AgeRange.AGE_18_24 || profile.getAgeRange() == AgeRange.AGE_25_34)
                .count();
        Map<String, Long> regionParticipation = profiles.stream()
                .filter(profile -> profile.getRegion() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        profile -> profile.getRegion().getName(),
                        LinkedHashMap::new,
                        java.util.stream.Collectors.counting()
                ));

        return Map.of(
                "womenParticipation", womenParticipation,
                "youthParticipation", youthParticipation,
                "regionParticipation", regionParticipation
        );
    }

    public Map<String, Object> production(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        var activities = farmingActivityRepository.findAll();
        return Map.of(
                "totalActivities", activities.size(),
                "harvestedActivities", activities.stream().filter(a -> a.getStatus() == FarmingActivityStatus.HARVESTED).count(),
                "trackedFarmers", activities.stream().map(a -> a.getUser().getId()).distinct().count()
        );
    }

    public Map<String, Object> market(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        return Map.of(
                "activeProduceListings", produceListingRepository.countByStatus(ListingStatus.ACTIVE),
                "activeDemandListings", demandListingRepository.countByStatus(ListingStatus.ACTIVE)
        );
    }

    public Map<String, Object> opportunities(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        return Map.of("activeOpportunities", opportunityRepository.countByStatus(OpportunityStatus.ACTIVE));
    }

    public Map<String, Object> smes(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        long verified = businessProfileRepository.findAll().stream().filter(b -> "VERIFIED".equals(b.getVerificationStatus())).count();
        return Map.of("totalBusinesses", businessProfileRepository.count(), "verifiedBusinesses", verified);
    }

    public byte[] exportProduction(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        String csv = "metric,value\n" +
                "totalActivities," + farmingActivityRepository.count() + "\n" +
                "harvestedActivities," + farmingActivityRepository.findAll().stream().filter(a -> a.getStatus() == FarmingActivityStatus.HARVESTED).count() + "\n";
        return csv.getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportUsers(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        var profiles = userProfileRepository.findAll();
        List<Map.Entry<String, Long>> metrics = List.of(
                Map.entry("womenParticipation", profiles.stream().filter(profile -> profile.getGender() == Gender.FEMALE).count()),
                Map.entry("youthParticipation", profiles.stream()
                        .filter(profile -> profile.getAgeRange() == AgeRange.AGE_18_24 || profile.getAgeRange() == AgeRange.AGE_25_34)
                        .count()),
                Map.entry("profilesWithRegion", profiles.stream().filter(profile -> profile.getRegion() != null).count())
        );
        StringBuilder csv = new StringBuilder("metric,count\n");
        metrics.forEach(entry -> csv.append(entry.getKey()).append(",").append(entry.getValue()).append("\n"));
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportMarket(AppUserPrincipal principal) {
        ensureDashboardRole(principal);
        String csv = "metric,value\n" +
                "activeProduceListings," + produceListingRepository.countByStatus(ListingStatus.ACTIVE) + "\n" +
                "activeDemandListings," + demandListingRepository.countByStatus(ListingStatus.ACTIVE) + "\n";
        return csv.getBytes(StandardCharsets.UTF_8);
    }

    private void ensureDashboardRole(AppUserPrincipal principal) {
        if (principal.getAccountType() != AccountType.ADMIN && principal.getAccountType() != AccountType.DONOR_VIEWER) {
            throw new AppException("FORBIDDEN", "Dashboard access denied", HttpStatus.FORBIDDEN);
        }
    }
}
