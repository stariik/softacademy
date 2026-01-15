import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { sendBulkSMS } from '@/lib/sms'

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const { recipients, content } = await request.json()

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'მიმღებები მითითებული არ არის' },
        { status: 400 }
      )
    }

    const result = await sendBulkSMS(recipients, content)

    return NextResponse.json({
      success: result.success,
      failed: result.failed,
    })
  } catch (error) {
    console.error('Send SMS error:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
