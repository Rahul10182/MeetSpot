import express from 'express'
import {authenticate,getFireBaseId,getUserFireBaseId} from "../controllers/userController.js"
import isAuthenticated from '../middlewares/Auth.js';


const router = express.Router();

router.route("/authenticate").post(authenticate);         
router.route("/getId").post(getUserFireBaseId);
router.route("/getfirebaseid").post(getFireBaseId);

// router.route("/login").post(login);
// router.route("/logout").get(isAuthenticated, logout);
// router.route("/").post(authenticate);
// // router.route("/route").get((req, res)=>{
// //     res.send("HI");
// // })

// router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;