'use client'

import { useEffect } from 'react'

export interface VisitEntry {
  timestamp: number
  date: string
  time: string
  userAgent: string
  device: string
  browser: string
  referrer: string
  path: string
}

const MAX_VISITS = 100 // keep last 100 visits
const VISITS_KEY = 'elenalens-visits'
const SESSION_KEY = 'elenalens-session-id'

/**
 * Generate a unique session ID for this browser.
 * Stored in localStorage so it persists across visits.
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'unknown'
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

/**
 * Detect device type from user agent.
 */
function detectDevice(ua: string): string {
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/iPad|Tablet/i.test(ua)) return 'Планшет'
    return 'Телефон'
  }
  return 'Компьютер'
}

/**
 * Detect browser from user agent.
 */
function detectBrowser(ua: string): string {
  if (/Edg/i.test(ua)) return 'Edge'
  if (/Chrome/i.test(ua)) return 'Chrome'
  if (/Firefox/i.test(ua)) return 'Firefox'
  if (/Safari/i.test(ua)) return 'Safari'
  if (/Opera|OPR/i.test(ua)) return 'Opera'
  return 'Другой'
}

/**
 * Format timestamp to readable date/time in Russian.
 */
function formatDateTime(ts: number): { date: string; time: string } {
  const d = new Date(ts)
  const months = [
    'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
  ]
  const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return { date, time }
}

/**
 * Log a visit to localStorage.
 * Called once per page load (not per session — tracks every visit).
 */
export function logVisit() {
  if (typeof window === 'undefined') return

  const ua = navigator.userAgent
  const { date, time } = formatDateTime(Date.now())

  const entry: VisitEntry = {
    timestamp: Date.now(),
    date,
    time,
    userAgent: ua,
    device: detectDevice(ua),
    browser: detectBrowser(ua),
    referrer: document.referrer || 'Прямой заход',
    path: window.location.pathname,
  }

  try {
    const raw = localStorage.getItem(VISITS_KEY)
    const visits: VisitEntry[] = raw ? JSON.parse(raw) : []
    visits.push(entry)
    // Keep only last MAX_VISITS
    if (visits.length > MAX_VISITS) {
      visits.splice(0, visits.length - MAX_VISITS)
    }
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits))
  } catch (e) {
    // localStorage might be full or disabled
    console.warn('Could not log visit:', e)
  }
}

/**
 * Get all logged visits (newest first).
 */
export function getVisits(): VisitEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(VISITS_KEY)
    const visits: VisitEntry[] = raw ? JSON.parse(raw) : []
    return visits.reverse() // newest first
  } catch {
    return []
  }
}

/**
 * Clear all visit logs.
 */
export function clearVisits() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(VISITS_KEY)
}

/**
 * Get visit statistics.
 */
export function getVisitStats() {
  const visits = getVisits()
  const total = visits.length
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTs = today.getTime()
  const todayCount = visits.filter(v => v.timestamp >= todayTs).length

  // Unique sessions (by user agent fingerprint — approximate)
  const uniqueDevices = new Set(visits.map(v => v.device + v.browser))

  // Last visit
  const lastVisit = visits.length > 0 ? visits[0] : null

  return {
    total,
    today: todayCount,
    unique: uniqueDevices.size,
    lastVisit,
  }
}

/**
 * Hook that logs a visit on mount.
 * Used in the main page to track all visitors.
 */
export function useVisitTracker() {
  useEffect(() => {
    logVisit()
  }, [])

  return null
}
