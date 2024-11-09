import express from 'express'
import {authenticate} from "../controllers/userController.js";



const router = express.Router();


router.route("/authenticate").post(authenticate);
export default router;