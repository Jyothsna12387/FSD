import express from 'express';
import {
  submitRoomApplication,
//   getAllApplications,
} from '../controllers/roomApplication.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .post(protect, restrictTo('student'), submitRoomApplication)
//   .get(protect, restrictTo('warden', 'admin'), getAllApplications);

export default router;
