import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { parseCSV } from '@/lib/csvParser'

export interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  agency_id: number
  position: string
  created_at: string
}

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contacts = parseCSV<Contact>('contacts_contact_rows.csv')
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error reading contacts:', error)
    return NextResponse.json({ error: 'Failed to load contacts' }, { status: 500 })
  }
}