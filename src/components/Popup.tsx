// components/Popup.tsx
'use client'

import React, { useEffect, useState } from 'react'

interface PopupProps {
  message: string
  type: 'success' | 'error'
}

const Popup: React.FC<PopupProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {message}
    </div>
  )
}

export default Popup
