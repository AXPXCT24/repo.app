import express from "express";
import * as VehicleController from "../controllers/VehicleDetailsController.js";

const router = express.Router();

router.get("/", VehicleController.getVehicle);
router.get("/:plate_number", VehicleController.getVehicleDetails);
router.post("/insert-vehicle", VehicleController.addVehicleDetails);

router.delete("/delete/:plate_number", VehicleController.deleteVehicleEntry);

export default router;
