import { Review } from "../models/reviewModel.js";

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { userId, venueId, rating, comment } = req.body;

        // Check if a review from this user for this venue already exists
        const existingReview = await Review.findOne({ user: userId, venue: venueId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this venue" });
        }

        const newReview = new Review({
            user: userId,
            venue: venueId,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Update review details
        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({ message: "Review updated", review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reviews for a specific venue
export const getVenueReviews = async (req, res) => {
    try {
        const { venueId } = req.params;

        const reviews = await Review.find({ venue: venueId })
            .populate("user", "name email")
            .sort({ createdAt: -1 }); // Sort by most recent

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
