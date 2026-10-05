package com.blogapp.backend.repository;

import com.blogapp.backend.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserId(Long userId);
    Optional<Bookmark> findByPostIdAndUserId(Long postId, Long userId);
    Boolean existsByPostIdAndUserId(Long postId, Long userId);
}