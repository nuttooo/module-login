// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Error logging in user:', error)
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 })
  }
}
