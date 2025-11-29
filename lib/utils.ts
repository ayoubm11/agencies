export function checkDailyLimit(userId: string): { canView: boolean; count: number } {
  if (typeof window === 'undefined') return { canView: true, count: 0 }
  
  const today = new Date().toISOString().split('T')[0]
  const key = `contact_views_${userId}_${today}`
  
  const stored = localStorage.getItem(key)
  const count = stored ? parseInt(stored, 10) : 0
  
  return {
    canView: count < 50,
    count
  }
}

export function incrementViewCount(userId: string): number {
  if (typeof window === 'undefined') return 0
  
  const today = new Date().toISOString().split('T')[0]
  const key = `contact_views_${userId}_${today}`
  
  const stored = localStorage.getItem(key)
  const count = stored ? parseInt(stored, 10) : 0
  const newCount = count + 1
  
  localStorage.setItem(key, newCount.toString())
  return newCount
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}