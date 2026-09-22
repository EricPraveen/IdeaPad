package com.blogapp.backend.repository;

import com.blogapp.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByStatus(String status);
    List<Post> findByGenreAndStatus(String genre, String status);
    List<Post> findByTitleContainingIgnoreCaseAndStatus(String title, String status);
    List<Post> findByAuthorIdAndStatus(Long authorId, String status);
    List<Post> findByIsFeaturedTrueAndStatus(String status);
}