package com.samiagrihub.learning.repository;

import com.samiagrihub.learning.entity.LessonFeedback;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonFeedbackRepository extends JpaRepository<LessonFeedback, Long> {
    Optional<LessonFeedback> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<LessonFeedback> findByLessonId(Long lessonId);
}
