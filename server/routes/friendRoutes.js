import express from "express";
import { acceptFriendRequest, deleteFriend, rejectFriendRequest, sendFriendRequest, sentFrienReqest, showFriendRequest, showFriends } from '../controllers/friendController.js';

const router = express.Router();

router.route("/old").post(showFriends);

router.route("/new").post(showFriendRequest);

router.route("/sendreq").post(sendFriendRequest);

router.route("/sentreq").post(sentFrienReqest);

router.route("/accept").post(acceptFriendRequest);

router.route("/reject").post(rejectFriendRequest);

router.route("/delete").post(deleteFriend);

export default router;