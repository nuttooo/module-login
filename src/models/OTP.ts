// models/OTP.ts
import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    required: true,
  },
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
export default OTP;
