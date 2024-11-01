import express from "express";
import {
    createFriendRequest,
    acceptFriendRequest,
    blockFriend,
    getFriends
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/friends/request", createFriendRequest);
router.put("/friends/accept/:requestId", acceptFriendRequest);
router.put("/friends/block/:requestId", blockFriend);
router.get("/friends/:userId", getFriends);

export default router;
