import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Cette route n'est pas utilisée actuellement
  // La logique de limite est gérée côté client dans lib/utils.ts
  return NextResponse.json({ 
    message: 'This endpoint is not implemented. Check limit is handled client-side.' 
  })
}