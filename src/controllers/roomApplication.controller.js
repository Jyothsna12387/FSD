import asyncHandler from '../utils/asyncHandler.js';
import RoomApplication from '../models/RoomApplication.model.js';

//students can able to submit their room application
export const submitRoomApplication = asyncHandler(async (req, res) => {
  const {
    preferredBuilding,
    roomType,
    preferredRoommates,
    specialRequirements,
    agreedToRules,
  } = req.body;

  if (!agreedToRules) {
    res.status(400);
    throw new Error('You must agree to the hostel rules and regulations');
  }

  const application = new RoomApplication({
    student: req.user._id,
    preferredBuilding,
    roomType,
    preferredRoommates,
    specialRequirements,
    agreedToRules,
  });

  await application.save();

  res.status(201).json({
    success: true,
    message: 'Room application submitted successfully',
    data: application,
  });
});

// Get all room applications (for warden or admin)
// export const getAllApplications = asyncHandler(async (req, res) => {
//   const applications = await RoomApplication.find().populate('student', 'name email');
//   res.status(200).json({ success: true, data: applications });
// });
