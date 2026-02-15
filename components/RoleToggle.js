'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RoleToggle({ currentRole }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleRole = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/toggle-role', {
        method: 'POST',
      })

      if (!res.ok) {
        alert('Failed to toggle role')
        setLoading(false)
        return
      }

      const { newRole } = await res.json()
      console.log('Role toggled to:', newRole)
      
      // Refresh page to show new role view
      router.refresh()
    } catch (error) {
      console.error('Toggle error:', error)
      alert('Error toggling role')
      setLoading(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
      <p className="text-sm text-yellow-800 mb-3">
        <strong>Portfolio Demo:</strong> Şu anda {currentRole === 'ADMIN' ? 'Admin' : 'Kullanıcı'} olarak giriş yaptınız.
      </p>
      <Button
        onClick={toggleRole}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        {loading ? 'Değiştiriliyor...' : `${currentRole === 'ADMIN' ? 'Kullanıcı' : 'Admin'} Olarak Gir`}
      </Button>
    </div>
  )
}
