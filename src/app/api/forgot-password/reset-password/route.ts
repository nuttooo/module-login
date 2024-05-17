import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import OTP from '../../../../models/OTP';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, otp, newPassword } = await req.json();

  if (!email || !otp || !newPassword) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const otpDoc = await OTP.findOne({ userId: user._id, otp, otpExpires: { $gt: Date.now() } });
    if (!otpDoc) {
      return NextResponse.json({ message: 'Invalid OTP or OTP expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    await OTP.deleteOne({ _id: otpDoc._id });

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
