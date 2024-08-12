import express from "express";
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPost, getLikesPost, getUserPosts, likeUnlikePost } from "../controllers/post.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();


// Get All Posts
router.get("/allPosts", protectedRoute, getAllPosts)

// Create a new Post
router.post("/create", protectedRoute, createPost);

// Delete Post
router.delete("/delete/:id", protectedRoute, deletePost);

// Comment Post
router.post("/comment/:id", protectedRoute, commentOnPost);

// Single post like
router.post("/like/:id", protectedRoute, likeUnlikePost);

// All post Like List
router.get("/likes/:id", protectedRoute, getLikesPost);

router.get("/following", protectedRoute, getFollowingPost);

// Get User all Post
router.get("/user/:username", protectedRoute, getUserPosts);

// router.post("/update:id", protectedRoute, updatePost);


export default router;