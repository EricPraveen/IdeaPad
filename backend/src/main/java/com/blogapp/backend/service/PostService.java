package com.blogapp.backend.service;

import com.blogapp.backend.dto.PostRequest;
import com.blogapp.backend.dto.PostResponse;
import com.blogapp.backend.model.Like;
import com.blogapp.backend.model.Post;
import com.blogapp.backend.model.User;
import com.blogapp.backend.repository.LikeRepository;
import com.blogapp.backend.repository.PostRepository;
import com.blogapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    public PostResponse createPost(PostRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCoverImage(request.getCoverImage());
        post.setGenre(request.getGenre());
        post.setStatus(request.getStatus() != null ? request.getStatus() : "draft");
        post.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false);
        post.setAuthor(user);

        postRepository.save(post);
        return mapToResponse(post);
    }

    public List<PostResponse> getAllPublishedPosts() {
        return postRepository.findByStatus("published")
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToResponse(post);
    }

    public List<PostResponse> getPostsByGenre(String genre) {
        return postRepository.findByGenreAndStatus(genre, "published")
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> searchPosts(String query) {
        return postRepository.findByTitleContainingIgnoreCaseAndStatus(query, "published")
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    public List<PostResponse> getDraftsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postRepository.findByAuthorIdAndStatus(user.getId(), "draft")
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PostResponse getRandomPost() {
        List<Post> posts = postRepository.findByStatus("published");
        if (posts.isEmpty()) throw new RuntimeException("No posts found");
        Collections.shuffle(posts);
        return mapToResponse(posts.get(0));
    }

    public List<PostResponse> getFeaturedPosts() {
        return postRepository.findByIsFeaturedTrueAndStatus("published")
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PostResponse updatePost(Long id, PostRequest request, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCoverImage(request.getCoverImage());
        post.setGenre(request.getGenre());
        post.setStatus(request.getStatus());
        post.setIsAnonymous(request.getIsAnonymous());
        post.setUpdatedAt(LocalDateTime.now());

        postRepository.save(post);
        return mapToResponse(post);
    }

    public void deletePost(Long id, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        postRepository.delete(post);
    }

    public void toggleLike(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        likeRepository.findByPostIdAndUserId(postId, user.getId())
                .ifPresentOrElse(
                        like -> likeRepository.delete(like),
                        () -> {
                            Like like = new Like();
                            like.setPost(post);
                            like.setUser(user);
                            likeRepository.save(like);
                        }
                );
    }

    public boolean checkLikeStatus(Long postId, String email) {
        if (email == null) return false;
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return false;
        return likeRepository.findByPostIdAndUserId(postId, user.getId()).isPresent();
    }

    public List<PostResponse> getPostsByUserId(Long userId) {
        return postRepository.findByAuthorIdAndStatus(userId, "published")
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
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