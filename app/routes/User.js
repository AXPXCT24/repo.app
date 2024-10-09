import * as UserController from "../controllers/UserController.js";
import express from "express";

const router = express.Router();

router.get("/", UserController.getAllUser);
router.get("/:username", UserController.getUser);
router.post("/create-user", UserController.createUser);

router.delete("/delete/:username", UserController.deleteUser);

export default router;
