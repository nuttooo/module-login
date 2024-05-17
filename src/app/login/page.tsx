// app/login/page.tsx
'use client'

import { getCsrfToken, signIn } from 'next-auth/react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Popup from '../../components/Popup'

const Login: React.FC = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken()
      if (token) {
        setCsrfToken(token)
      }
    }
    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('Please enter both email and password')
      setSuccess(null)
      return
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error || 'Invalid email or password')
      setSuccess(null)
    } else {
      setError(null)
      setSuccess('Login successful')
      
      // Notify login
      try {
        await axios.post('/api/login-notify', { email })
        console.log('Login notification email sent successfully')
      } catch (error) {
        console.error('Error notifying login:', error)
      }

      router.push('/dashboard')
    }
  }

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken || ''} />
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        {error && <Popup message={error} type="error" />}
        {success && <Popup message={success} type="success" />}
        <div className="mt-4">
          <Link href="/register" className="text-blue-500">Register</Link>
        </div>
        <div className="mt-2">
          <Link href="/forgot-password/send-otp" className="text-blue-500">Forgot Password?</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
