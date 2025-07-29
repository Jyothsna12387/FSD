  import express from 'express';
import { submitRoomApplication,  getStudentNameByFieldId } from '../controllers/roomApplication.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// POST /api/v1/room-application
router.post('/', protect, restrictTo('student'), submitRoomApplication);

// GET /api/v1/room-application/student-name/:fieldID-->autofill student name based on fieldID
router.get('/name/:fieldId', getStudentNameByFieldId);


export default router;
