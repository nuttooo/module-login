import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import VerificationToken from '../../../models/VerificationToken'

export async function GET(req: NextRequest) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 })
  }

  try {
    const verificationToken = await VerificationToken.findOne({ token }).populate('userId')
    if (!verificationToken) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })
    }

    if (verificationToken.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Token has expired' }, { status: 400 })
    }

    const user = verificationToken.userId
    user.status = 'Active'
    await user.save()

    await VerificationToken.deleteOne({ token })

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`)
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
