import express from 'express'
import {authenticate} from "../controllers/userController.js"
import isAuthenticated from '../middlewares/Auth.js';


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/").post(authenticate);
// router.route("/route").get((req, res)=>{
//     res.send("HI");
// })

router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;