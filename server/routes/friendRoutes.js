import express from "express";
import {
    createFriendRequest,
    acceptFriendRequest,
    blockFriend,
    getFriends
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/request", createFriendRequest);
router.put("/accept/:requestId", acceptFriendRequest);
router.put("/block/:requestId", blockFriend);
router.get("/:firebaseId", getFriends);

export default router;
