import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { parseCSV } from '@/lib/csvParser'

export interface Agency {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  website: string
}

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const agencies = parseCSV<Agency>('agencies_agency_rows.csv')
    return NextResponse.json(agencies)
  } catch (error) {
    console.error('Error reading agencies:', error)
    return NextResponse.json({ error: 'Failed to load agencies' }, { status: 500 })
  }
}
