package com.samiagrihub.learning.controller;

import com.samiagrihub.common.api.ApiResponse;
import com.samiagrihub.common.security.SecurityContextService;
import com.samiagrihub.learning.dto.CourseModuleRequest;
import com.samiagrihub.learning.dto.CourseRequest;
import com.samiagrihub.learning.dto.LessonRequest;
import com.samiagrihub.learning.service.LearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLearningController {
    private final LearningService learningService;
    private final SecurityContextService securityContextService;

    @PostMapping("/courses")
    public ApiResponse<?> createCourse(@Valid @RequestBody CourseRequest request) { return ApiResponse.success(learningService.saveCourse(request, null, securityContextService.currentUser())); }
    @PutMapping("/courses/{courseId}")
    public ApiResponse<?> updateCourse(@PathVariable Long courseId, @Valid @RequestBody CourseRequest request) { return ApiResponse.success(learningService.saveCourse(request, courseId, securityContextService.currentUser())); }
    @PostMapping("/courses/{courseId}/modules")
    public ApiResponse<?> createModule(@PathVariable Long courseId, @Valid @RequestBody CourseModuleRequest request) { return ApiResponse.success(learningService.saveModule(courseId, request, null, securityContextService.currentUser())); }
    @PutMapping("/course-modules/{moduleId}")
    public ApiResponse<?> updateModule(@PathVariable Long moduleId, @Valid @RequestBody CourseModuleRequest request) { return ApiResponse.success(learningService.saveModule(null, request, moduleId, securityContextService.currentUser())); }
    @PostMapping("/modules/{moduleId}/lessons")
    public ApiResponse<?> createLesson(@PathVariable Long moduleId, @Valid @RequestBody LessonRequest request) { return ApiResponse.success(learningService.saveLesson(moduleId, request, null, securityContextService.currentUser())); }
    @PutMapping("/lessons/{lessonId}")
    public ApiResponse<?> updateLesson(@PathVariable Long lessonId, @Valid @RequestBody LessonRequest request) { return ApiResponse.success(learningService.saveLesson(null, request, lessonId, securityContextService.currentUser())); }
    @GetMapping("/courses")
    public ApiResponse<?> courses(Pageable pageable) { return ApiResponse.success(learningService.listCourses(pageable, true)); }
    @PatchMapping("/courses/{courseId}/archive")
    public ApiResponse<?> archiveCourse(@PathVariable Long courseId) { return ApiResponse.success(learningService.archiveCourse(courseId, securityContextService.currentUser())); }
    @GetMapping("/lessons/{lessonId}/feedback-summary")
    public ApiResponse<?> feedbackSummary(@PathVariable Long lessonId) { return ApiResponse.success(learningService.feedbackSummary(lessonId, securityContextService.currentUser())); }
}
