// app/profile/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Loading from '../../components/Loading'
import Link from 'next/link'

const Profile: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session) {
      axios.get(`/api/profile?email=${session.user.email}`)
        .then(response => {
          setUserData(response.data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching profile data:', error)
          setError('Failed to load profile data')
          setLoading(false)
        })
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, session])

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <strong className="w-32 text-gray-700">First Name:</strong> 
          <span>{userData?.firstName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="w-32 text-gray-700">Last Name:</strong> 
          <span>{userData?.lastName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="w-32 text-gray-700">Phone Number:</strong> 
          <span>{userData?.phoneNumber}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="w-32 text-gray-700">Email:</strong> 
          <span>{userData?.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="w-32 text-gray-700">Role:</strong> 
          <span>{userData?.role}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="w-32 text-gray-700">Status:</strong> 
          <span>{userData?.status}</span>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Link href="/profile/edit" legacyBehavior>
          <a className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            Edit Profile
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Profile
