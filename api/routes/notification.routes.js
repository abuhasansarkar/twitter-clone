import express from "express";
import { deleteNotificaions, deleteSingleNotificaions, getNotificaions } from "../controllers/notification.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/", protectedRoute, getNotificaions)
router.delete("/", protectedRoute, deleteNotificaions)
router.delete("/:id", protectedRoute, deleteSingleNotificaions)

export default router;