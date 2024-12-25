import express from 'express'
import {authenticate,getFireBaseId, getUserFireBaseId,getEmailId} from "../controllers/userController.js";



const router = express.Router();


router.route("/authenticate").post(authenticate);
router.route("/getfirebaseid").post(getFireBaseId);
router.route("/getId").post(getUserFireBaseId);
router.route("/getEmail").post(getEmailId);

export default router;