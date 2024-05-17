// components/Loading.tsx
import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="text-white mb-4">Loading...</div>
        <div className="w-12 h-12 border-4 border-t-4 border-t-green-500 border-green-700 rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default Loading
