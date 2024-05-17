import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import VerificationToken from '../../../models/VerificationToken'
import { sendEmail } from '../../../lib/sendEmail'
import { toZonedTime, formatInTimeZone } from 'date-fns-tz'
import * as crypto from 'crypto'

export async function POST(req: NextRequest) {
  await dbConnect()

  const { username, email, password, firstName, lastName, phoneNumber } = await req.json()

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const now = new Date()
    const timeZone = 'Asia/Bangkok'
    const zonedDate = toZonedTime(now, timeZone)
    const formattedDate = formatInTimeZone(zonedDate, timeZone, 'yyyy-MM-dd HH:mm:ss zzz')

    const user = new User({
      username,
      email,
      password: passwordHash,
      firstName: firstName || null,
      lastName: lastName || null,
      phoneNumber: phoneNumber || null,
      role: 'User',
      status: 'Unverified',
      createdAt: formattedDate,
      updatedAt: formattedDate,
    })

    await user.save()

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000)

    const token = new VerificationToken({
      userId: user._id,
      token: verificationToken,
      expiresAt: verificationTokenExpires,
    })

    await token.save()

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${verificationToken}`

    const logoUrl = 'https://drive.google.com/uc?export=view&id=1cpiNQfwzLR1KuopMFh5HwgP9MCOwgZ9g'

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; padding: 20px; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Devonix Logo" style="max-width: 150px;" />
        </div>
        <p>Hi ${firstName},</p>
        <p>Please click the following link to verify your email address. This link will expire in 15 minutes:</p>
        <p><a href="${verificationLink}" style="color: #007BFF;">Verify Email</a></p>
        <p><strong>Timestamp:</strong> ${formattedDate}</p>
        <p>Thanks,<br>Devonix Team</p>
        <footer style="font-size: 12px; color: #888; margin-top: 20px;">
          <p>This message was sent from Devonix, Co., Ltd. 530 Village No. 5, Pru Yai Subdistrict, Mueang Nakhon Ratchasima District, Nakhon Ratchasima Province 30000</p>
        </footer>
      </div>
    `

    await sendEmail({
      to: email,
      subject: `[Devonix]: Email Verification for ${user.email}`,
      html: emailHtml,
    })

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
