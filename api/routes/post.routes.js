import express from "express";
import { commentOnPost, createPost, deletePost } from "../controllers/post.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();

// Create a new Post
router.post("/create", protectedRoute, createPost)

// Delete Post
router.delete("/delete/:id", protectedRoute, deletePost)

// Comment Post
router.post("/comment/:id", protectedRoute, commentOnPost)

// router.post("/update:id", protectedRoute, updatePost)
// router.post("/like:id", protectedRoute, likeUnlikePost)


export default router;