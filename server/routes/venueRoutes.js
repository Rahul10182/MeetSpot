import express from 'express'
import { getVenueSuggestions, selectVenue,getUserVenues} from '../controllers/venueController.js';
import isAuthenticated from '../middlewares/Auth.js';


const router = express.Router();

router.route("/get").post( getVenueSuggestions);
router.route("/select").post( selectVenue);
router.get('/allvenues/:firebaseID', getUserVenues); // use :firebaseID in both URL and controller


export default router;