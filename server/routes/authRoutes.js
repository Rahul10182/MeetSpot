import express from 'express'
import {register, login, updateProfile, logout} from "../controllers/userController.js"
import isAuthenticated from '../middlewares/Auth.js';


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);

router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;