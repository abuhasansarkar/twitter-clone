import express from "express";
import {
  getMe,
  singIn,
  singOut,
  singUp,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

//

router.get("/me", protectedRoute, getMe);

router.post("/signup", singUp);

router.post("/signin", singIn);

router.get("/signout", singOut);

export default router;
