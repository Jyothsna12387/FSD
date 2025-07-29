  import mongoose from 'mongoose';

const roomApplicationSchema = new mongoose.Schema({
  fieldID: {
    type: String,
    required: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  roomACType: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  parentMobile: {
    type: String,
    required: true
  },
  agreedToRules: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('RoomApplication', roomApplicationSchema, 'roomapplications');
