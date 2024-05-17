// app/api/test-db/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    return NextResponse.json({ message: 'Database connection successful' })
  } catch (error) {
    return NextResponse.json({ message: 'Database connection failed', error }, { status: 500 })
  }
}
