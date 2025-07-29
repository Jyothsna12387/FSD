 
import mongoose from 'mongoose';

const roomApplicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  preferredBuilding: {
    type: String,
    enum: ['Building A', 'Building B', 'Building C'],
    required: true,
  },
  roomType: {
    type: String,
    enum: ['Single Occupancy', 'Double Occupancy', 'Shared 4 Persons'],
    required: true,
  },
  preferredRoommates: {
    type: [String], // student IDs or names
    default: [],
  },
  specialRequirements: {
    type: String,
    default: '',
  },
  agreedToRules: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const RoomApplication = mongoose.model('RoomApplication', roomApplicationSchema, 'room');
export default RoomApplication;
