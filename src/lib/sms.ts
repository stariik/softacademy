import twilio from 'twilio'
import { getSettings } from './settings'

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    const settings = await getSettings([
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'TWILIO_PHONE_NUMBER',
    ])

    const accountSid = settings.TWILIO_ACCOUNT_SID
    const authToken = settings.TWILIO_AUTH_TOKEN
    const fromNumber = settings.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio credentials not configured')
      return false
    }

    const client = twilio(accountSid, authToken)

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    })

    return true
  } catch (error) {
    console.error('Failed to send SMS:', error)
    return false
  }
}

export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = []
  const failed: string[] = []

  for (const recipient of recipients) {
    const sent = await sendSMS(recipient, message)
    if (sent) {
      success.push(recipient)
    } else {
      failed.push(recipient)
    }
  }

  return { success, failed }
}
