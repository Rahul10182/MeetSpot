import express from 'express'
import { getUserVenues, getVenueSuggestions, selectVenue } from '../controllers/venueController.js';

const router = express.Router();

router.route("/get").post( getVenueSuggestions);
router.route("/select").post( selectVenue);
router.route("/visited").get(getUserVenues);

export default router;