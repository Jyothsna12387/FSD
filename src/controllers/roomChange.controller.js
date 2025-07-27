import RoomChangeRequest from '../models/RoomChange.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/v1/room-change
export const submitRoomChange = asyncHandler(async (req, res) => {
  try {
    console.log("📩 Room change request received");
    console.log("Request user:", req.user);
    console.log("Request body:", req.body);
    
    const { preferredBlock, preferredRoomNumber, reason } = req.body;
    const studentId = req.user._id;

    const newRequest = await RoomChangeRequest.create({
      student: studentId,
      preferredBlock,
      preferredRoomNumber,
      reason,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Room change request submitted successfully',
      data: newRequest,
    });
  } catch (error) {
    console.error("❌ Error creating room change request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// GET /api/v1/room-change/my-requests
export const getMyRoomChangeRequests = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const requests = await RoomChangeRequest.find({ student: studentId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: requests,
  });
});

 export const getLatestRoomChangeRequest = asyncHandler(async (req, res) => {
  const latestRequest = await RoomChangeRequest.findOne({ student: req.user._id })
    .sort({ createdAt: -1 });

  if (!latestRequest) {
    return res.status(404).json({ message: 'No room change request found.' });
  }

  res.status(200).json(latestRequest); // ✅ Make sure this includes "status"
});

export const getRoomChangeHistory = async (req, res) => {
  const history = await RoomChangeRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(history);
};


