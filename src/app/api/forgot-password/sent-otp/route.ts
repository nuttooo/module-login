import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import OTP from '../../../../models/OTP';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER as string, // your Gmail address
      pass: process.env.EMAIL_PASS as string, // your Gmail password or App Password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM as string,
    to,
    subject,
    html,
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Missing email' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('Generated OTP:', otp); // Log the generated OTP

    // Delete any existing OTPs that are still valid
    await OTP.deleteMany({ userId: user._id, otpExpires: { $gt: Date.now() } });

    const otpDoc = new OTP({
      userId: user._id,
      otp: otp,
      otpExpires: Date.now() + 3600000, // OTP will expire in 1 hour
    });

    await otpDoc.save();
    console.log('OTP saved:', otpDoc); // Log the saved OTP

    const now = new Date();
    const timeZone = 'Asia/Bangkok';
    const zonedDate = toZonedTime(now, timeZone);
    const formattedDate = formatInTimeZone(zonedDate, timeZone, 'yyyy-MM-dd HH:mm:ss zzz');

    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.ip;

    const logoUrl = 'https://drive.google.com/uc?export=view&id=1cpiNQfwzLR1KuopMFh5HwgP9MCOwgZ9g';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Devonix Logo" style="max-width: 150px;" />
        </div>
        <h2>Dear ${user.firstName} ${user.lastName},</h2>
        <p>We have received a request to access your account. To proceed, please use the following One-Time Password (OTP):</p>
        <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${otp}</p>
        <p>This OTP is valid for 1 hour. If you did not request this, please ignore this email or contact support.</p>
        <p>Thank you,<br>Devonix Co.,Ltd.</p>
        <p><strong>Timestamp:</strong> ${formattedDate}<br />
        <strong>IP Address:</strong> ${ipAddress}<br />
        <strong>User agent:</strong> ${req.headers.get('user-agent')}</p>
        <footer style="font-size: 12px; color: #888; margin-top: 20px;">
          <p>This message was sent from Devonix, Co., Ltd. 530 Village No. 5, Pru Yai Subdistrict, Mueang Nakhon Ratchasima District, Nakhon Ratchasima Province 30000</p>
        </footer>
      </div>
    `;

    await sendEmail(email, 'Your OTP Code', emailHtml);

    return NextResponse.json({ message: '[Devonix]: Verify Your Account with OTP' }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
