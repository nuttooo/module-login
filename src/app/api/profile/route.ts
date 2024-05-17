import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile data:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect()

  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { firstName, lastName, phoneNumber, currentPassword, newPassword } = await req.json()

  try {
    const user = await User.findOne({ email: token.email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 })
      }
      user.passwordHash = await bcrypt.hash(newPassword, 12)
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.updatedAt = new Date()

    await user.save()

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
