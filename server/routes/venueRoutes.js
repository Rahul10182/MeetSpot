import express from 'express'
import { getVenueSuggestions, selectVenue,getUserVenues, getTopVenues, createVenue, getVenueById} from '../controllers/venueController.js';


const router = express.Router();

router.route("/get").post( getVenueSuggestions);
router.route("/select").post( selectVenue);
router.get('/allvenues/:firebaseID', getUserVenues); 
router.get("/top/:userId", getTopVenues);
router.post("/create", createVenue);
router.get("/getVenue", getVenueById);


export default router;