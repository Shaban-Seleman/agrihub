package com.samiagrihub.learning.service;

import com.samiagrihub.common.api.PageResponse;
import com.samiagrihub.common.api.PageResponseMapper;
import com.samiagrihub.common.audit.AuditAction;
import com.samiagrihub.common.audit.AuditService;
import com.samiagrihub.common.exception.AppException;
import com.samiagrihub.common.security.AppUserPrincipal;
import com.samiagrihub.learning.dto.CourseModuleRequest;
import com.samiagrihub.learning.dto.CourseRequest;
import com.samiagrihub.learning.dto.LessonFeedbackRequest;
import com.samiagrihub.learning.dto.LessonRequest;
import com.samiagrihub.learning.entity.ContentStatus;
import com.samiagrihub.learning.entity.Course;
import com.samiagrihub.learning.entity.CourseModule;
import com.samiagrihub.learning.entity.Lesson;
import com.samiagrihub.learning.entity.LessonFeedback;
import com.samiagrihub.learning.entity.UserCourseProgress;
import com.samiagrihub.learning.repository.CourseModuleRepository;
import com.samiagrihub.learning.repository.CourseRepository;
import com.samiagrihub.learning.repository.LessonFeedbackRepository;
import com.samiagrihub.learning.repository.LessonRepository;
import com.samiagrihub.learning.repository.UserCourseProgressRepository;
import com.samiagrihub.user.entity.AccountType;
import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.repository.UserRepository;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearningService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final LessonRepository lessonRepository;
    private final UserCourseProgressRepository userCourseProgressRepository;
    private final LessonFeedbackRepository lessonFeedbackRepository;
    private final UserRepository userRepository;
    private final PageResponseMapper pageResponseMapper;
    private final AuditService auditService;

    public PageResponse<Map<String, Object>> listCourses(Pageable pageable, boolean adminView) {
        Page<Course> page = adminView
                ? courseRepository.findAll(pageable)
                : courseRepository.findByStatus(ContentStatus.PUBLISHED, pageable);
        return pageResponseMapper.toPageResponse(page.map(this::toCourseSummary));
    }

    public Map<String, Object> getCourse(Long courseId, boolean adminView, Long userId) {
        Course course = getCourseEntity(courseId);
        if (!adminView && course.getStatus() != ContentStatus.PUBLISHED) {
            throw new AppException("COURSE_NOT_AVAILABLE", "Course is not available", HttpStatus.NOT_FOUND);
        }
        List<Map<String, Object>> modules = courseModuleRepository.findByCourseIdOrderByDisplayOrderAsc(courseId).stream()
                .map(module -> {
                    List<Map<String, Object>> lessons = lessonRepository.findByModuleIdOrderByDisplayOrderAsc(module.getId()).stream()
                            .filter(lesson -> adminView || lesson.getStatus() == ContentStatus.PUBLISHED)
                            .map(lesson -> toLessonSummary(lesson, userId))
                            .toList();
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", module.getId());
                    map.put("title", module.getTitle());
                    map.put("summary", module.getSummary());
                    map.put("displayOrder", module.getDisplayOrder());
                    map.put("lessons", lessons);
                    return map;
                })
                .toList();
        Map<String, Object> response = new LinkedHashMap<>(toCourseSummary(course));
        response.put("modules", modules);
        return response;
    }

    public Map<String, Object> getLesson(Long lessonId, AppUserPrincipal principal) {
        Lesson lesson = getLessonEntity(lessonId);
        if (lesson.getStatus() != ContentStatus.PUBLISHED) {
            throw new AppException("LESSON_NOT_AVAILABLE", "Lesson is not available", HttpStatus.NOT_FOUND);
        }
        User user = getUser(principal.getUserId());
        boolean completed = userCourseProgressRepository.findByUserIdAndLessonId(user.getId(), lessonId).isPresent();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", lesson.getId());
        map.put("moduleId", lesson.getModule().getId());
        map.put("courseId", lesson.getModule().getCourse().getId());
        map.put("title", lesson.getTitle());
        map.put("content", lesson.getContent());
        map.put("mediaUrl", lesson.getMediaUrl());
        map.put("durationMinutes", lesson.getDurationMinutes());
        map.put("displayOrder", lesson.getDisplayOrder());
        map.put("completed", completed);
        return map;
    }

    @Transactional
    public Map<String, Object> completeLesson(Long lessonId, AppUserPrincipal principal) {
        Lesson lesson = getLessonEntity(lessonId);
        User user = getUser(principal.getUserId());
        userCourseProgressRepository.findByUserIdAndLessonId(user.getId(), lessonId).orElseGet(() ->
                userCourseProgressRepository.save(UserCourseProgress.builder()
                        .user(user)
                        .course(lesson.getModule().getCourse())
                        .lesson(lesson)
                        .completedAt(OffsetDateTime.now())
                        .build()));
        return Map.of("lessonId", lessonId, "completed", true);
    }

    @Transactional
    public Map<String, Object> upsertFeedback(Long lessonId, AppUserPrincipal principal, LessonFeedbackRequest request) {
        Lesson lesson = getLessonEntity(lessonId);
        User user = getUser(principal.getUserId());
        LessonFeedback feedback = lessonFeedbackRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .orElse(LessonFeedback.builder().user(user).lesson(lesson).build());
        feedback.setHelpful(request.helpful());
        feedback.setComment(request.comment());
        LessonFeedback saved = lessonFeedbackRepository.save(feedback);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("lessonId", lessonId);
        map.put("helpful", saved.isHelpful());
        map.put("comment", saved.getComment());
        return map;
    }

    public Map<String, Object> getFeedback(Long lessonId, AppUserPrincipal principal) {
        User user = getUser(principal.getUserId());
        return lessonFeedbackRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .map(feedback -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("lessonId", lessonId);
                    map.put("helpful", feedback.isHelpful());
                    map.put("comment", feedback.getComment());
                    return map;
                })
                .orElse(Map.of("lessonId", lessonId));
    }

    public List<Map<String, Object>> getCourseProgress(AppUserPrincipal principal) {
        Long userId = principal.getUserId();
        return courseRepository.findByStatus(ContentStatus.PUBLISHED, Pageable.unpaged()).getContent().stream()
                .map(course -> {
                    long totalLessons = lessonRepository.findByModuleCourseIdAndStatusOrderByDisplayOrderAsc(course.getId(), ContentStatus.PUBLISHED).size();
                    long completed = userCourseProgressRepository.countByUserIdAndCourseId(userId, course.getId());
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("courseId", course.getId());
                    map.put("title", course.getTitle());
                    map.put("completedLessons", completed);
                    map.put("totalLessons", totalLessons);
                    map.put("percentage", totalLessons == 0 ? 0 : (completed * 100 / totalLessons));
                    return map;
                })
                .toList();
    }

    public Map<String, Object> learningHome(AppUserPrincipal principal) {
        List<Map<String, Object>> progress = getCourseProgress(principal);
        Map<String, Object> featured = courseRepository.findByStatus(ContentStatus.PUBLISHED, Pageable.ofSize(1))
                .stream().findFirst().map(this::toCourseSummary).orElse(Map.of());
        return Map.of("featuredCourse", featured, "progress", progress);
    }

    @Transactional
    public Map<String, Object> saveCourse(CourseRequest request, Long courseId, AppUserPrincipal principal) {
        ensureAdmin(principal);
        Course course = courseId == null ? new Course() : getCourseEntity(courseId);
        course.setTitle(request.title());
        course.setSummary(request.summary());
        course.setCoverImageUrl(request.coverImageUrl());
        course.setStatus(request.status());
        course.setPublishedAt(request.status() == ContentStatus.PUBLISHED ? OffsetDateTime.now() : course.getPublishedAt());
        if (request.status() == ContentStatus.ARCHIVED) {
            course.setArchivedAt(OffsetDateTime.now());
        }
        Course saved = courseRepository.save(course);
        if (request.status() == ContentStatus.ARCHIVED || request.status() == ContentStatus.PUBLISHED) {
            auditService.log(
                    principal.getUserId(),
                    request.status() == ContentStatus.ARCHIVED ? AuditAction.COURSE_ARCHIVED : AuditAction.COURSE_PUBLISHED,
                    "COURSE",
                    String.valueOf(saved.getId()),
                    request.status().name()
            );
        }
        return toCourseSummary(saved);
    }

    @Transactional
    public Map<String, Object> saveModule(Long courseId, CourseModuleRequest request, Long moduleId, AppUserPrincipal principal) {
        ensureAdmin(principal);
        CourseModule module = moduleId == null ? new CourseModule() : courseModuleRepository.findById(moduleId)
                .orElseThrow(() -> new AppException("MODULE_NOT_FOUND", "Course module not found", HttpStatus.NOT_FOUND));
        Course course = moduleId == null ? getCourseEntity(courseId) : module.getCourse();
        module.setCourse(course);
        module.setTitle(request.title());
        module.setSummary(request.summary());
        module.setDisplayOrder(request.displayOrder());
        CourseModule saved = courseModuleRepository.save(module);
        return Map.of("id", saved.getId(), "title", saved.getTitle(), "displayOrder", saved.getDisplayOrder());
    }

    @Transactional
    public Map<String, Object> saveLesson(Long moduleId, LessonRequest request, Long lessonId, AppUserPrincipal principal) {
        ensureAdmin(principal);
        Lesson lesson = lessonId == null ? new Lesson() : getLessonEntity(lessonId);
        CourseModule module = lessonId == null
                ? courseModuleRepository.findById(moduleId)
                    .orElseThrow(() -> new AppException("MODULE_NOT_FOUND", "Course module not found", HttpStatus.NOT_FOUND))
                : lesson.getModule();
        lesson.setModule(module);
        lesson.setTitle(request.title());
        lesson.setContent(request.content());
        lesson.setMediaUrl(request.mediaUrl());
        lesson.setDurationMinutes(request.durationMinutes());
        lesson.setDisplayOrder(request.displayOrder());
        lesson.setStatus(request.status());
        Lesson saved = lessonRepository.save(lesson);
        return Map.of("id", saved.getId(), "title", saved.getTitle(), "status", saved.getStatus().name());
    }

    @Transactional
    public Map<String, Object> archiveCourse(Long courseId, AppUserPrincipal principal) {
        ensureAdmin(principal);
        Course course = getCourseEntity(courseId);
        course.setStatus(ContentStatus.ARCHIVED);
        course.setArchivedAt(OffsetDateTime.now());
        courseRepository.save(course);
        return Map.of("courseId", courseId, "status", course.getStatus().name());
    }

    public Map<String, Object> feedbackSummary(Long lessonId, AppUserPrincipal principal) {
        ensureAdmin(principal);
        List<LessonFeedback> feedback = lessonFeedbackRepository.findByLessonId(lessonId);
        long helpful = feedback.stream().filter(LessonFeedback::isHelpful).count();
        return Map.of(
                "lessonId", lessonId,
                "totalFeedback", feedback.size(),
                "helpfulCount", helpful,
                "notHelpfulCount", feedback.size() - helpful
        );
    }

    private Map<String, Object> toCourseSummary(Course course) {
        long totalLessons = courseModuleRepository.findByCourseIdOrderByDisplayOrderAsc(course.getId()).stream()
                .mapToLong(module -> lessonRepository.findByModuleIdOrderByDisplayOrderAsc(module.getId()).stream()
                        .filter(lesson -> lesson.getStatus() == ContentStatus.PUBLISHED)
                        .count())
                .sum();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", course.getId());
        map.put("title", course.getTitle());
        map.put("summary", course.getSummary());
        map.put("coverImageUrl", course.getCoverImageUrl());
        map.put("status", course.getStatus().name());
        map.put("totalLessons", totalLessons);
        return map;
    }

    private Map<String, Object> toLessonSummary(Lesson lesson, Long userId) {
        boolean completed = userId != null && userCourseProgressRepository.findByUserIdAndLessonId(userId, lesson.getId()).isPresent();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", lesson.getId());
        map.put("title", lesson.getTitle());
        map.put("durationMinutes", lesson.getDurationMinutes());
        map.put("displayOrder", lesson.getDisplayOrder());
        map.put("completed", completed);
        return map;
    }

    private Course getCourseEntity(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("COURSE_NOT_FOUND", "Course not found", HttpStatus.NOT_FOUND));
    }

    private Lesson getLessonEntity(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException("LESSON_NOT_FOUND", "Lesson not found", HttpStatus.NOT_FOUND));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException("USER_NOT_FOUND", "User not found", HttpStatus.NOT_FOUND));
    }

    private void ensureAdmin(AppUserPrincipal principal) {
        if (principal.getAccountType() != AccountType.ADMIN) {
            throw new AppException("FORBIDDEN", "Admin access required", HttpStatus.FORBIDDEN);
        }
    }
}
