import express from "express";
import {
    createLocation,
    updateLocation,
    deleteLocation,
    getAllLocations
} from "../controllers/locationController.js";

const router = express.Router();

router.post("/locations", createLocation);
router.put("/locations/:locationId", updateLocation);
router.delete("/locations/:locationId", deleteLocation);
router.get("/locations", getAllLocations);

export default router;
