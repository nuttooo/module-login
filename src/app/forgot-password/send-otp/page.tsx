'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Popup from '../../../components/Popup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SendOTP: React.FC = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/forgot-password/sent-otp', { email }) 
      if (response.status === 200) {
        setError(null)
        setSuccess('OTP sent to email')
        router.push('/forgot-password/reset-password') // เปลี่ยนเส้นทางไปยังหน้ารับ OTP และรีเซ็ตรหัสผ่าน
      }
    } catch (error) {
      setError('Failed to send OTP')
      setSuccess(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Send OTP
          </button>
        </form>
        {error && <Popup message={error} type="error" />}
        {success && <Popup message={success} type="success" />}
        <div className="mt-4">
          <Link href="/login" className="text-blue-500">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default SendOTP
