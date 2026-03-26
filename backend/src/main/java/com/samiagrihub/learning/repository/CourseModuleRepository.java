package com.samiagrihub.learning.repository;

import com.samiagrihub.learning.entity.CourseModule;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
    List<CourseModule> findByCourseIdOrderByDisplayOrderAsc(Long courseId);
}
