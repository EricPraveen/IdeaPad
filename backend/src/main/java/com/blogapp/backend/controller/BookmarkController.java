package com.blogapp.backend.controller;

import com.blogapp.backend.model.Bookmark;
import com.blogapp.backend.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @GetMapping
    public ResponseEntity<List<Bookmark>> getUserBookmarks(Authentication authentication) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(authentication.getName()));
    }

    @PostMapping("/{postId}")
    public ResponseEntity<String> toggleBookmark(
            @PathVariable Long postId,
            Authentication authentication) {
        return ResponseEntity.ok(bookmarkService.toggleBookmark(postId, authentication.getName()));
    }
}