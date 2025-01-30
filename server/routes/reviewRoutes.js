import express from "express";
import {
    createReview,
    updateReview,
    deleteReview,
    getVenueReviews
} from "../controllers/reviewController.js";
import isAuthenticated from '../middlewares/Auth.js';

const router = express.Router();

router.route("/create").post( createReview);
router.route("/update").put( updateReview);
router.route("/delete").delete( deleteReview);

router.route("/get").get( getVenueReviews);

export default router;
