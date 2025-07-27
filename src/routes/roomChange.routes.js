import express from 'express';
import { submitRoomChange, getMyRoomChangeRequests, getRoomChangeHistory } from '../controllers/roomChange.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/room-change', protect, restrictTo('student'), submitRoomChange);

// Student fetches latest request
router.get('/room-change/latest',  protect, restrictTo('student'), getMyRoomChangeRequests);
router.get('/room-change/history', protect, restrictTo('student'), getRoomChangeHistory);


export default router;
