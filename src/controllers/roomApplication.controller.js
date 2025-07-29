  import asyncHandler from '../utils/asyncHandler.js';
import RoomApplication from '../models/RoomApplication.model.js';
import User from '../models/User.model.js';

// ➤ POST: Submit room application
export const submitRoomApplication = asyncHandler(async (req, res) => {
  const {
    fieldID,
    studentName,
    roomType,
    roomACType,
    contactNumber,
    parentMobile,
    agreedToRules
  } = req.body;

  // Validate if student with fieldID exists
  const student = await User.findOne({ fieldId: fieldID });
  if (!student) {
    res.status(404);
    throw new Error('Student with the provided Field ID not found');
  }

  const newApplication = await RoomApplication.create({
    fieldID,
    studentName,
    roomType,
    roomACType,
    contactNumber,
    parentMobile,
    agreedToRules
  });

  res.status(201).json({ message: 'Room application submitted successfully' });
});

// ➤ GET: Get student name by field ID
export const getStudentNameByFieldId = asyncHandler(async (req, res) => {
  const user = await User.findOne({ fieldId: req.params.fieldId });

  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.status(200).json({ name: user.fullName });
});

