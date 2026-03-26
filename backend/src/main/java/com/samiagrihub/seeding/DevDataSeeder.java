package com.samiagrihub.seeding;

import com.samiagrihub.advisory.entity.AdvisoryContent;
import com.samiagrihub.advisory.entity.AdvisoryStatus;
import com.samiagrihub.advisory.repository.AdvisoryContentRepository;
import com.samiagrihub.common.config.SeedProperties;
import com.samiagrihub.farming.entity.FarmingActivity;
import com.samiagrihub.farming.entity.FarmingActivityStatus;
import com.samiagrihub.farming.repository.FarmingActivityRepository;
import com.samiagrihub.learning.entity.ContentStatus;
import com.samiagrihub.learning.entity.Course;
import com.samiagrihub.learning.entity.CourseModule;
import com.samiagrihub.learning.entity.Lesson;
import com.samiagrihub.learning.repository.CourseModuleRepository;
import com.samiagrihub.learning.repository.CourseRepository;
import com.samiagrihub.learning.repository.LessonRepository;
import com.samiagrihub.market.entity.DemandListing;
import com.samiagrihub.market.entity.ListingStatus;
import com.samiagrihub.market.entity.ProduceListing;
import com.samiagrihub.market.repository.DemandListingRepository;
import com.samiagrihub.market.repository.ProduceListingRepository;
import com.samiagrihub.opportunity.entity.Opportunity;
import com.samiagrihub.opportunity.entity.OpportunityStatus;
import com.samiagrihub.opportunity.entity.OpportunityType;
import com.samiagrihub.opportunity.repository.OpportunityRepository;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.BusinessProfile;
import com.samiagrihub.user.entity.BusinessProfileCommodity;
import com.samiagrihub.user.entity.BusinessType;
import com.samiagrihub.user.entity.Crop;
import com.samiagrihub.user.entity.FarmerProfile;
import com.samiagrihub.user.entity.Gender;
import com.samiagrihub.user.entity.AgeRange;
import com.samiagrihub.user.entity.PartnerOrganizationType;
import com.samiagrihub.user.entity.PartnerProfile;
import com.samiagrihub.user.entity.Region;
import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.entity.UserCropInterest;
import com.samiagrihub.user.entity.UserProfile;
import com.samiagrihub.user.entity.UserStatus;
import com.samiagrihub.user.repository.BusinessProfileCommodityRepository;
import com.samiagrihub.user.repository.BusinessProfileRepository;
import com.samiagrihub.user.repository.CropRepository;
import com.samiagrihub.user.repository.FarmerProfileRepository;
import com.samiagrihub.user.repository.PartnerProfileRepository;
import com.samiagrihub.user.repository.RegionRepository;
import com.samiagrihub.user.repository.UserCropInterestRepository;
import com.samiagrihub.user.repository.UserProfileRepository;
import com.samiagrihub.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DevDataSeeder implements ApplicationRunner {

    private final SeedProperties seedProperties;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CropRepository cropRepository;
    private final RegionRepository regionRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final PartnerProfileRepository partnerProfileRepository;
    private final UserCropInterestRepository userCropInterestRepository;
    private final BusinessProfileCommodityRepository businessProfileCommodityRepository;
    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final LessonRepository lessonRepository;
    private final FarmingActivityRepository farmingActivityRepository;
    private final ProduceListingRepository produceListingRepository;
    private final DemandListingRepository demandListingRepository;
    private final OpportunityRepository opportunityRepository;
    private final AdvisoryContentRepository advisoryContentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!seedProperties.enabled()) {
            return;
        }
        seedUser("+255700000001", "Admin User", AccountType.ADMIN);
        seedUser("+255700000002", "Donor Viewer", AccountType.DONOR_VIEWER);
        User farmer = seedUser("+255700000003", "Demo Farmer", AccountType.FARMER_YOUTH);
        User sme = seedUser("+255700000004", "Mbeya Foods Ltd", AccountType.AGRI_SME);
        User partner = seedUser("+255700000005", "Kilimo Youth Trust", AccountType.PARTNER);
        seedProfilesAndDemoContent(farmer, sme, partner);
    }

    private User seedUser(String phoneNumber, String fullName, AccountType accountType) {
        return userRepository.findByPhoneNumber(phoneNumber).orElseGet(() -> {
            User user = userRepository.save(User.builder()
                    .phoneNumber(phoneNumber)
                    .passwordHash(passwordEncoder.encode("Password123"))
                    .accountType(accountType)
                    .status(UserStatus.ACTIVE)
                    .phoneVerified(true)
                    .build());
            userProfileRepository.save(UserProfile.builder()
                    .user(user)
                    .fullName(fullName)
                    .region(regionRepository.findAll().stream().findFirst().orElse(null))
                    .build());
            log.info("Seeded {} account {}", accountType, phoneNumber);
            return user;
        });
    }

    private void seedProfilesAndDemoContent(User farmer, User sme, User partner) {
        if (cropRepository.count() == 0 || regionRepository.count() == 0) {
            log.warn("Skipping demo content seeding because reference data is missing");
            return;
        }
        List<Crop> crops = cropRepository.findAll();
        Crop maize = crops.get(0);
        Crop rice = crops.size() > 1 ? crops.get(1) : maize;
        Region region = regionRepository.findAll().get(0);

        farmerProfileRepository.findByUser(farmer).orElseGet(() -> farmerProfileRepository.save(FarmerProfile.builder()
                .user(farmer)
                .gender(Gender.FEMALE)
                .ageRange(AgeRange.AGE_25_34)
                .primaryCrop(maize)
                .secondaryCrop(rice)
                .farmingExperience("4 years")
                .build()));
        if (userCropInterestRepository.findByUser(farmer).isEmpty()) {
            userCropInterestRepository.save(UserCropInterest.builder().user(farmer).crop(maize).build());
            userCropInterestRepository.save(UserCropInterest.builder().user(farmer).crop(rice).build());
        }

        BusinessProfile businessProfile = businessProfileRepository.findByUser(sme).orElseGet(() -> businessProfileRepository.save(BusinessProfile.builder()
                .user(sme)
                .businessName("Mbeya Foods Ltd")
                .businessType(BusinessType.PROCESSOR)
                .registrationNumber("TZ-MBY-2041")
                .verificationStatus("VERIFIED")
                .visibleInDirectory(true)
                .build()));
        if (businessProfileCommodityRepository.findByBusinessProfile(businessProfile).isEmpty()) {
            businessProfileCommodityRepository.save(BusinessProfileCommodity.builder().businessProfile(businessProfile).crop(maize).build());
            businessProfileCommodityRepository.save(BusinessProfileCommodity.builder().businessProfile(businessProfile).crop(rice).build());
        }

        partnerProfileRepository.findByUser(partner).orElseGet(() -> partnerProfileRepository.save(PartnerProfile.builder()
                .user(partner)
                .organizationName("Kilimo Youth Trust")
                .organizationType(PartnerOrganizationType.NGO)
                .focusArea("Youth agribusiness training")
                .build()));

        seedCourse();
        FarmingActivity activity = seedFarmingActivity(farmer, maize);
        seedMarket(farmer, sme, activity, maize, rice, region);
        seedOpportunities(sme, partner, maize, region);
        seedAdvisory(maize, rice, region);
    }

    private void seedCourse() {
        if (courseRepository.count() > 0) {
            return;
        }
        Course course = courseRepository.save(Course.builder()
                .title("Kilimo Biashara Msingi")
                .summary("Practical agribusiness skills for smallholder youth and farmers.")
                .status(ContentStatus.PUBLISHED)
                .publishedAt(OffsetDateTime.now())
                .build());
        for (int moduleIndex = 1; moduleIndex <= 6; moduleIndex++) {
            CourseModule module = courseModuleRepository.save(CourseModule.builder()
                    .course(course)
                    .title("Moduli " + moduleIndex)
                    .summary("Mafunzo ya moduli " + moduleIndex)
                    .displayOrder(moduleIndex)
                    .build());
            for (int lessonIndex = 1; lessonIndex <= 2; lessonIndex++) {
                lessonRepository.save(Lesson.builder()
                        .module(module)
                        .title("Somo " + moduleIndex + "." + lessonIndex)
                        .content("Maudhui ya somo kuhusu uzalishaji, masoko, na usimamizi wa biashara ya kilimo.")
                        .durationMinutes(10 + lessonIndex)
                        .displayOrder(lessonIndex)
                        .status(ContentStatus.PUBLISHED)
                        .build());
            }
        }
    }

    private FarmingActivity seedFarmingActivity(User farmer, Crop crop) {
        return farmingActivityRepository.findByUserId(farmer.getId(), org.springframework.data.domain.Pageable.ofSize(1))
                .stream().findFirst().orElseGet(() -> farmingActivityRepository.save(FarmingActivity.builder()
                        .user(farmer)
                        .crop(crop)
                        .seasonCode("2026-MSIMU-A")
                        .landSize(new BigDecimal("2.50"))
                        .landUnit("ACRE")
                        .plantingDate(LocalDate.now().minusMonths(3))
                        .harvestDate(LocalDate.now().minusDays(7))
                        .actualYield(new BigDecimal("38.00"))
                        .yieldUnit("BAG")
                        .farmingMethod("Rain-fed")
                        .notes("Demo seeded activity")
                        .status(FarmingActivityStatus.HARVESTED)
                        .build()));
    }

    private void seedMarket(User farmer, User sme, FarmingActivity activity, Crop maize, Crop rice, Region region) {
        if (produceListingRepository.count() == 0) {
            produceListingRepository.save(ProduceListing.builder()
                    .user(farmer)
                    .farmingActivity(activity)
                    .crop(maize)
                    .title("Mahindi ya kuuza")
                    .description("Mahindi safi kutoka Chamwino")
                    .quantity(new BigDecimal("40"))
                    .unit("BAG")
                    .pricePerUnit(new BigDecimal("85000"))
                    .region(region)
                    .contactName("Demo Farmer")
                    .contactPhone(farmer.getPhoneNumber())
                    .expiresAt(OffsetDateTime.now().plusDays(14))
                    .status(ListingStatus.ACTIVE)
                    .build());
        }
        if (demandListingRepository.count() == 0) {
            demandListingRepository.save(DemandListing.builder()
                    .user(sme)
                    .crop(rice)
                    .title("Uhitaji wa mpunga")
                    .description("Tunatafuta tani 5 za mpunga")
                    .quantity(new BigDecimal("5000"))
                    .unit("KG")
                    .offeredPricePerUnit(new BigDecimal("1200"))
                    .region(region)
                    .contactName("Mbeya Foods Ltd")
                    .contactPhone(sme.getPhoneNumber())
                    .expiresAt(OffsetDateTime.now().plusDays(20))
                    .status(ListingStatus.ACTIVE)
                    .build());
        }
    }

    private void seedOpportunities(User sme, User partner, Crop crop, Region region) {
        if (opportunityRepository.count() == 0) {
            opportunityRepository.save(Opportunity.builder()
                    .createdByUser(sme)
                    .title("Training ya ubora wa mazao")
                    .summary("Mafunzo ya siku mbili kwa wasindikaji na wakulima.")
                    .opportunityType(OpportunityType.TRAINING)
                    .crop(crop)
                    .region(region)
                    .contactDetails("info@mbeyafoods.tz")
                    .deadline(OffsetDateTime.now().plusDays(10))
                    .status(OpportunityStatus.ACTIVE)
                    .build());
            opportunityRepository.save(Opportunity.builder()
                    .createdByUser(partner)
                    .title("Youth agribusiness grant call")
                    .summary("Small grant window for youth-led agribusiness pilots.")
                    .opportunityType(OpportunityType.GRANT)
                    .region(region)
                    .externalApplicationLink("https://example.org/grants")
                    .deadline(OffsetDateTime.now().plusDays(21))
                    .status(OpportunityStatus.ACTIVE)
                    .build());
        }
    }

    private void seedAdvisory(Crop maize, Crop rice, Region region) {
        if (advisoryContentRepository.count() > 0) {
            return;
        }
        advisoryContentRepository.save(AdvisoryContent.builder()
                .title("Udhibiti wa viwavijeshi")
                .summary("Hatua za mapema za kudhibiti fall armyworm.")
                .content("Kagua shamba mara mbili kwa wiki, tumia mbinu shirikishi za udhibiti, na wasiliana na mtaalam wa ugani inapobidi.")
                .crop(maize)
                .region(region)
                .status(AdvisoryStatus.PUBLISHED)
                .publishedAt(OffsetDateTime.now())
                .build());
        advisoryContentRepository.save(AdvisoryContent.builder()
                .title("Mavuno na uhifadhi wa mpunga")
                .summary("Mbinu za kupunguza hasara baada ya mavuno.")
                .content("Vuna kwa wakati, kausha kwa kiwango kinachofaa, na hifadhi kwenye maghala safi yenye uingizaji hewa.")
                .crop(rice)
                .region(region)
                .status(AdvisoryStatus.PUBLISHED)
                .publishedAt(OffsetDateTime.now())
                .build());
    }
}
