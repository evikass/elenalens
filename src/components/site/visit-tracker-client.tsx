'use client'

import { useEffect } from 'react'
import { logVisit } from './visit-tracker'

/**
 * Client component that logs a visit on mount.
 * Rendered in page.tsx (Server Component) — this wrapper makes it
 * client-side only.
 */
export function VisitTracker() {
  useEffect(() => {
    logVisit()
  }, [])

  return null
}
