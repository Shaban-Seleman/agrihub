package com.samiagrihub.learning.repository;

import com.samiagrihub.learning.entity.ContentStatus;
import com.samiagrihub.learning.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Page<Course> findByStatus(ContentStatus status, Pageable pageable);
}
