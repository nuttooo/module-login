// app/settings/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/navigation'

const Settings: React.FC = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div>
        <p>Settings page content goes here...</p>
      </div>
    </div>
  )
}

export default Settings
