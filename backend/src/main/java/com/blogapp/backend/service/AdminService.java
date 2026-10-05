package com.blogapp.backend.service;

import com.blogapp.backend.dto.PostResponse;
import com.blogapp.backend.model.Post;
import com.blogapp.backend.model.Report;
import com.blogapp.backend.repository.LikeRepository;
import com.blogapp.backend.repository.PostRepository;
import com.blogapp.backend.repository.ReportRepository;
import com.blogapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    public List<Post> getPendingPosts() {
        return postRepository.findByStatus("pending");
    }

    public List<PostResponse> getPendingPostResponses() {
        return postRepository.findByStatus("pending")
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Post approvePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus("published");
        return postRepository.save(post);
    }

    public PostResponse approvePostResponse(Long id) {
        return mapToResponse(approvePost(id));
    }

    public Post featurePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setIsFeatured(!post.getIsFeatured());
        return postRepository.save(post);
    }

    public PostResponse featurePostResponse(Long id) {
        return mapToResponse(featurePost(id));
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatus("pending");
    }

    public Report resolveReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus("resolved");
        return reportRepository.save(report);
    }

    private PostResponse mapToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setCoverImage(post.getCoverImage());
        response.setGenre(post.getGenre());
        response.setStatus(post.getStatus());
        response.setIsAnonymous(post.getIsAnonymous());
        response.setIsFeatured(post.getIsFeatured());
        response.setCreatedAt(post.getCreatedAt());
        response.setLikeCount(likeRepository.countByPostId(post.getId()));
        response.setAuthorId(post.getAuthor().getId());
        response.setAuthorEmail(post.getAuthor().getEmail());
        if (Boolean.TRUE.equals(post.getIsAnonymous())) {
            response.setAuthorName("Anonymous");
        } else {
            response.setAuthorName(post.getAuthor().getName());
        }
        return response;
    }
}
