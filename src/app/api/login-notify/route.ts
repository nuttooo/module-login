import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/sendEmail';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { getToken } from 'next-auth/jwt';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const timeZone = 'Asia/Bangkok';
    const zonedDate = toZonedTime(now, timeZone);
    const formattedDate = formatInTimeZone(zonedDate, timeZone, 'yyyy-MM-dd HH:mm:ss zzz');

    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.ip;

    const logoUrl = 'https://drive.google.com/uc?export=view&id=1cpiNQfwzLR1KuopMFh5HwgP9MCOwgZ9g';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; padding: 20px; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Devonix Logo" style="max-width: 150px;" />
        </div>
        <p>We're verifying a recent sign-in for <a href="mailto:${email}" style="color: #007BFF;">${email}</a>:</p>
        <p><strong>Timestamp:</strong> ${formattedDate}<br />
        <strong>IP Address:</strong> ${ipAddress}<br />
        <strong>User agent:</strong> ${req.headers.get('user-agent')}</p>
        <p>You're receiving this message because of a successful sign-in from a device that we didn't recognize. <strong>If you believe that this sign-in is suspicious, <a href="YOUR_PASSWORD_RESET_URL" style="color: #007BFF;">please reset your password immediately</a>.</strong></p>
        <p>If you're aware of this sign-in, please disregard this notice. This can happen when you use your browser's incognito or private browsing mode or clear your cookies.</p>
        <p>Thanks,<br>Devonix Team</p>
        <footer style="font-size: 12px; color: #888; margin-top: 20px;">
          <p>This message was sent from Devonix, Co., Ltd. 530 Village No. 5, Pru Yai Subdistrict, Mueang Nakhon Ratchasima District, Nakhon Ratchasima Province 30000</p>
        </footer>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `[Devonix]: Successful sign-in for ${user.email} at ${formattedDate}`,
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Notification email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending notification email:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
