import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { sendBulkEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const { recipients, subject, content } = await request.json()

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'მიმღებები მითითებული არ არის' },
        { status: 400 }
      )
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563EB; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SoftAcademy</h1>
          </div>
          <div class="content">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
            <p>SoftAcademy - ონლაინ კურსები</p>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await sendBulkEmail(recipients, subject, html)

    return NextResponse.json({
      success: result.success,
      failed: result.failed,
    })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    )
  }
}
