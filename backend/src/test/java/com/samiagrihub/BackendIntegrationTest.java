package com.samiagrihub;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.samiagrihub.auth.entity.OtpChallenge;
import com.samiagrihub.auth.repository.OtpChallengeRepository;
import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BackendIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private OtpChallengeRepository otpChallengeRepository;
    @Autowired private UserRepository userRepository;

    @Test
    void registerVerifyLoginAndFetchMe() throws Exception {
        String phone = "+255700123456";
        mockMvc.perform(post("/api/v1/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "Password123",
                                  "accountType": "FARMER_YOUTH",
                                  "fullName": "Asha Mtemi"
                                }
                                """.formatted(phone)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING_OTP"));

        User user = userRepository.findByPhoneNumber(phone).orElseThrow();
        OtpChallenge challenge = otpChallengeRepository.findTopByUserOrderByCreatedAtDesc(user).orElseThrow();

        mockMvc.perform(post("/api/v1/auth/verify-otp")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "otpCode": "%s"
                                }
                                """.formatted(phone, challenge.getOtpCode())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "Password123"
                                }
                                """.formatted(phone)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("samiagrihub_session"))
                .andReturn();

        mockMvc.perform(get("/api/v1/me")
                        .cookie(loginResult.getResponse().getCookie("samiagrihub_session")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.phoneNumber").value(phone))
                .andExpect(jsonPath("$.data.accountType").value("FARMER_YOUTH"));
    }

    @Test
    void completeFarmerOnboarding() throws Exception {
        String phone = "+255700654321";
        mockMvc.perform(post("/api/v1/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "Password123",
                                  "accountType": "FARMER_YOUTH",
                                  "fullName": "Neema John"
                                }
                                """.formatted(phone)))
                .andExpect(status().isOk());

        User user = userRepository.findByPhoneNumber(phone).orElseThrow();
        OtpChallenge challenge = otpChallengeRepository.findTopByUserOrderByCreatedAtDesc(user).orElseThrow();
        mockMvc.perform(post("/api/v1/auth/verify-otp")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "otpCode": "%s"
                                }
                                """.formatted(phone, challenge.getOtpCode())))
                .andExpect(status().isOk());

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "Password123"
                                }
                                """.formatted(phone)))
                .andExpect(status().isOk())
                .andReturn();

        MvcResult regions = mockMvc.perform(get("/api/v1/metadata/regions")).andReturn();
        JsonNode regionId = objectMapper.readTree(regions.getResponse().getContentAsString()).path("data").get(0).path("id");

        MvcResult districts = mockMvc.perform(get("/api/v1/metadata/districts").param("regionId", regionId.asText())).andReturn();
        JsonNode districtId = objectMapper.readTree(districts.getResponse().getContentAsString()).path("data").get(0).path("id");

        MvcResult wards = mockMvc.perform(get("/api/v1/metadata/wards").param("districtId", districtId.asText())).andReturn();
        JsonNode wardId = objectMapper.readTree(wards.getResponse().getContentAsString()).path("data").get(0).path("id");

        MvcResult crops = mockMvc.perform(get("/api/v1/metadata/crops")).andReturn();
        JsonNode cropData = objectMapper.readTree(crops.getResponse().getContentAsString()).path("data");
        long primaryCropId = cropData.get(0).path("id").asLong();
        long secondaryCropId = cropData.get(1).path("id").asLong();

        var authCookie = loginResult.getResponse().getCookie("samiagrihub_session");

        mockMvc.perform(put("/api/v1/me/profile")
                        .with(csrf())
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Neema John",
                                  "email": "neema@example.com",
                                  "regionId": %s,
                                  "districtId": %s,
                                  "wardId": %s
                                }
                                """.formatted(regionId.asText(), districtId.asText(), wardId.asText())))
                .andExpect(status().isOk());

        mockMvc.perform(put("/api/v1/me/farmer-profile")
                        .with(csrf())
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "gender": "FEMALE",
                                  "ageRange": "AGE_25_34",
                                  "primaryCropId": %s,
                                  "secondaryCropId": %s,
                                  "farmingExperience": "3 years"
                                }
                                """.formatted(primaryCropId, secondaryCropId)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/me/crop-interests")
                        .with(csrf())
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "cropIds": [%s, %s]
                                }
                                """.formatted(primaryCropId, secondaryCropId)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/me/profile-completion").cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.percentage").value(100));
    }

    @Test
    void changePasswordAndLogout() throws Exception {
        String phone = "+255700999111";
        mockMvc.perform(post("/api/v1/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "Password123",
                                  "accountType": "FARMER_YOUTH",
                                  "fullName": "Mariam Kweka"
                                }
                                """.formatted(phone)))
                .andExpect(status().isOk());

        User user = userRepository.findByPhoneNumber(phone).orElseThrow();
        OtpChallenge challenge = otpChallengeRepository.findTopByUserOrderByCreatedAtDesc(user).orElseThrow();
        mockMvc.perform(post("/api/v1/auth/verify-otp")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "otpCode": "%s"
                                }
                                """.formatted(phone, challenge.getOtpCode())))
                .andExpect(status().isOk());

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "Password123"
                                }
                                """.formatted(phone)))
                .andExpect(status().isOk())
                .andReturn();

        var authCookie = loginResult.getResponse().getCookie("samiagrihub_session");

        mockMvc.perform(post("/api/v1/me/password")
                        .with(csrf())
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "currentPassword": "Password123",
                                  "newPassword": "NewPassword456",
                                  "confirmNewPassword": "NewPassword456"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.changed").value(true));

        mockMvc.perform(post("/api/v1/auth/logout").with(csrf()).cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("samiagrihub_session", 0));

        mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "Password123"
                                }
                                """.formatted(phone)))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "%s",
                                  "password": "NewPassword456"
                                }
                                """.formatted(phone)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("samiagrihub_session"));
    }

    @Test
    void unsafeRequestsWithoutCsrfAreRejected() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "phoneNumber": "+255711111111",
                                  "password": "Password123",
                                  "accountType": "FARMER_YOUTH",
                                  "fullName": "No Csrf User"
                                }
                                """))
                .andExpect(status().isForbidden());
    }
}
