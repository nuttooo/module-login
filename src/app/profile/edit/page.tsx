// app/profile/edit/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Popup from '../../../components/Popup'

const EditProfile: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session) {
      setEmail(session.user.email || '')
      // Fetch user data from the server to pre-fill the form (optional)
      axios.get(`/api/profile?email=${session.user.email}`)
        .then(response => {
          const { firstName, lastName, phoneNumber } = response.data
          setFirstName(firstName || '')
          setLastName(lastName || '')
          setPhoneNumber(phoneNumber || '')
        })
        .catch(error => {
          console.error('Error fetching profile data:', error)
        })
    }
  }, [status, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.put('/api/profile', { email, firstName, lastName, phoneNumber })

      if (response.status === 200) {
        setError(null)
        setSuccess('Profile updated successfully')
        router.push('/profile')
      } else {
        setSuccess(null)
        setError('Failed to update profile')
      }
    } catch (error) {
      setSuccess(null)
      setError('Failed to update profile')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
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
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700">First Name</label>
            <input
              name="firstName"
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
            <input
              name="lastName"
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
            <input
              name="phoneNumber"
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
        {error && <Popup message={error} type="error" />}
        {success && <Popup message={success} type="success" />}
      </div>
    </div>
  )
}

export default EditProfile
