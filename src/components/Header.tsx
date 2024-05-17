// components/Header.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Header: React.FC = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null; 
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex-shrink-0">
            <Link href="/" legacyBehavior>
              <a className="text-xl font-bold text-blue-600">MyApp</a>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/profile" legacyBehavior>
              <a className="text-gray-700 hover:text-blue-600">Profile</a>
            </Link>
            <Link href="/settings" legacyBehavior>
              <a className="text-gray-700 hover:text-blue-600">Settings</a>
            </Link>
            <button
              onClick={() => signOut()}
              className="text-gray-700 hover:text-blue-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
