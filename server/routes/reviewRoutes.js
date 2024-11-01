import express from "express";
import {
    createReview,
    updateReview,
    deleteReview,
    getVenueReviews
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/reviews", createReview);
router.put("/reviews/:reviewId", updateReview);
router.delete("/reviews/:reviewId", deleteReview);
router.get("/venues/:venueId/reviews", getVenueReviews);

export default router;
