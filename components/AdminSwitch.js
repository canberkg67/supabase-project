'use client'
import { useState } from 'react'

export default function AdminSwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <label className="flex items-center gap-2 mb-4">
      <input
        type="checkbox"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      Admin Modu
    </label>
  )
}
