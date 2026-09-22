package com.blogapp.backend.service;

import com.blogapp.backend.model.Bookmark;
import com.blogapp.backend.model.Post;
import com.blogapp.backend.model.User;
import com.blogapp.backend.repository.BookmarkRepository;
import com.blogapp.backend.repository.PostRepository;
import com.blogapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public String toggleBookmark(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Bookmark> existing =
                bookmarkRepository.findByPostIdAndUserId(postId, user.getId());

        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return "Bookmark removed";
        } else {
            Bookmark bookmark = new Bookmark();
            bookmark.setPost(post);
            bookmark.setUser(user);
            bookmarkRepository.save(bookmark);
            return "Bookmark added";
        }
    }

    public List<Bookmark> getUserBookmarks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookmarkRepository.findByUserId(user.getId());
    }
}