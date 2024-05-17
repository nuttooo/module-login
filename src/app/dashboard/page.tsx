// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '../../components/Loading'

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div>
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center">Welcome to the Dashboard</h1>
      </div>
    </div>
  )
}

export default Dashboard
