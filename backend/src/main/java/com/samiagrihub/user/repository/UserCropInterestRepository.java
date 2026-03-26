package com.samiagrihub.user.repository;

import com.samiagrihub.user.entity.User;
import com.samiagrihub.user.entity.UserCropInterest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCropInterestRepository extends JpaRepository<UserCropInterest, Long> {
    List<UserCropInterest> findByUser(User user);
    void deleteByUser(User user);
}
