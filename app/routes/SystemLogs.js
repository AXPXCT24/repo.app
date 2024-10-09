import express from "express";
import * as SystemLogsController from "../controllers/SystemLogsController.js";

const router = express.Router();

router.get("/", SystemLogsController.getAllLogs);
router.get("/:id", SystemLogsController.getSystemLog);
router.post("/insert-log", SystemLogsController.addSystemLog);

router.delete("/delete/:id");
router.delete("/delete-all");

export default router;
