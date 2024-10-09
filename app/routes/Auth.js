import express from "express";
import {
  authUser,
  logoutUser,
  sessionAuth,
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/", authUser);
router.post("/session", sessionAuth);
router.post("/logout", logoutUser);

export default router;
