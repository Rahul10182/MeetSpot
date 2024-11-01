import express from 'express'
import { getVenueSuggestions, selectVenue } from '../controllers/venueController.js';
import isAuthenticated from '../middlewares/Auth.js';


const router = express.Router();

router.route("/get").post(isAuthenticated, getVenueSuggestions);
router.route("/select").post(isAuthenticated, selectVenue);


export default router;