'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Popup from '../../../components/Popup'
import { useRouter } from 'next/navigation'

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);
    setSuccess(null);
    console.log('Sending data:', { email, otp, newPassword })
    try {
      const response = await axios.post('/api/forgot-password/reset-password', { email, otp, newPassword })
      if (response.status === 200) {
        setSuccess('Password reset successful')
        router.push('/login')
      }
    } catch (error) {
      setError('Failed to reset password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
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
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-700">OTP</label>
            <input
              name="otp"
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
            <input
              name="newPassword"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
        {error && <Popup message={error} type="error" />}
        {success && <Popup message={success} type="success" />}
      </div>
    </div>
  )
}

export default ResetPassword
