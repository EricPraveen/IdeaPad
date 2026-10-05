package com.blogapp.backend.controller;

import com.blogapp.backend.dto.PostResponse;
import com.blogapp.backend.model.Report;
import com.blogapp.backend.service.AdminService;
import com.blogapp.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PostService postService;

    @GetMapping("/posts/pending")
    public ResponseEntity<List<PostResponse>> getPendingPosts() {
        return ResponseEntity.ok(adminService.getPendingPostResponses());
    }

    @PutMapping("/posts/{id}/approve")
    public ResponseEntity<PostResponse> approvePost(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approvePostResponse(id));
    }

    @PutMapping("/posts/{id}/feature")
    public ResponseEntity<PostResponse> featurePost(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.featurePostResponse(id));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getPendingReports() {
        return ResponseEntity.ok(adminService.getPendingReports());
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<Report> resolveReport(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.resolveReport(id));
    }
}
