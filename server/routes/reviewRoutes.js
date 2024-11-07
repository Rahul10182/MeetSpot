import express from "express";
import {
    createReview,
    updateReview,
    deleteReview,
    getVenueReviews
} from "../controllers/reviewController.js";
import isAuthenticated from '../middlewares/Auth.js';

const router = express.Router();

router.route("/create").post(isAuthenticated, createReview);
router.route("/update/:reviewId").put(isAuthenticated, updateReview);
router.route("/delete/:reviewId").delete(isAuthenticated, deleteReview);

router.route("/get/:venueId/reviews").get(isAuthenticated, getVenueReviews);

export default router;
