import express from "express";
import {
  followUnfollowUser,
  getUserProfile,
  suggestedUserProfile,
  updateUser,
} from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);

router.get("/follow/:id", protectedRoute, followUnfollowUser);

router.get("/suggested/", protectedRoute, suggestedUserProfile);

router.get("/update/", protectedRoute, updateUser);

export default router;
