package com.blogapp.backend.repository;

import com.blogapp.backend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);
    Integer countByPostId(Long postId);
    Boolean existsByPostIdAndUserId(Long postId, Long userId);
}