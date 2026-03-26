package com.samiagrihub.learning.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.learning.dto.LessonFeedbackRequest;
import com.samiagrihub.learning.service.LearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LearningController {
    private final LearningService learningService;
    private final SecurityContextService securityContextService;

    @GetMapping("/courses")
    public ApiResponse<?> courses(Pageable pageable) { return ApiResponse.success(learningService.listCourses(pageable, false)); }
    @GetMapping("/courses/{courseId}")
    public ApiResponse<?> course(@PathVariable Long courseId) { return ApiResponse.success(learningService.getCourse(courseId, false, securityContextService.currentUser().getUserId())); }
    @GetMapping("/lessons/{lessonId}")
    public ApiResponse<?> lesson(@PathVariable Long lessonId) { return ApiResponse.success(learningService.getLesson(lessonId, securityContextService.currentUser())); }
    @PostMapping("/lessons/{lessonId}/complete")
    public ApiResponse<?> complete(@PathVariable Long lessonId) { return ApiResponse.success(learningService.completeLesson(lessonId, securityContextService.currentUser())); }
    @PostMapping("/lessons/{lessonId}/feedback")
    public ApiResponse<?> feedback(@PathVariable Long lessonId, @Valid @RequestBody LessonFeedbackRequest request) { return ApiResponse.success(learningService.upsertFeedback(lessonId, securityContextService.currentUser(), request)); }
    @GetMapping("/lessons/{lessonId}/feedback")
    public ApiResponse<?> getFeedback(@PathVariable Long lessonId) { return ApiResponse.success(learningService.getFeedback(lessonId, securityContextService.currentUser())); }
    @GetMapping("/me/course-progress")
    public ApiResponse<?> courseProgress() { return ApiResponse.success(learningService.getCourseProgress(securityContextService.currentUser())); }
    @GetMapping("/me/learning-home")
    public ApiResponse<?> learningHome() { return ApiResponse.success(learningService.learningHome(securityContextService.currentUser())); }
}
