package com.samiagrihub.learning.repository;

import com.samiagrihub.learning.entity.UserCourseProgress;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCourseProgressRepository extends JpaRepository<UserCourseProgress, Long> {
    Optional<UserCourseProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<UserCourseProgress> findByUserId(Long userId);
    long countByUserIdAndCourseId(Long userId, Long courseId);
}
