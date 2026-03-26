package com.samiagrihub.learning.repository;

import com.samiagrihub.learning.entity.ContentStatus;
import com.samiagrihub.learning.entity.Lesson;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByModuleIdOrderByDisplayOrderAsc(Long moduleId);
    List<Lesson> findByModuleCourseIdAndStatusOrderByDisplayOrderAsc(Long courseId, ContentStatus status);
}
