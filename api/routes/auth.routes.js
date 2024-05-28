import express from "express";
import { singIn, singOut, singUp } from "../controllers/auth.controller.js";

const router = express.Router();

//

router.post("/signup", singUp);

router.post("/signin", singIn);

router.get("/signout", singOut);

export default router;
