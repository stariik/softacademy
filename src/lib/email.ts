import nodemailer from 'nodemailer'
import { getSettings } from './settings'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

async function getTransporter() {
  const settings = await getSettings([
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'SMTP_FROM_EMAIL',
    'SMTP_FROM_NAME',
  ])

  if (!settings.SMTP_HOST || !settings.SMTP_USER || !settings.SMTP_PASSWORD) {
    return null
  }

  return nodemailer.createTransport({
    host: settings.SMTP_HOST,
    port: parseInt(settings.SMTP_PORT || '587'),
    secure: settings.SMTP_PORT === '465',
    auth: {
      user: settings.SMTP_USER,
      pass: settings.SMTP_PASSWORD,
    },
  })
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = await getTransporter()

    if (!transporter) {
      console.error('SMTP not configured')
      return false
    }

    const settings = await getSettings(['SMTP_FROM_EMAIL', 'SMTP_FROM_NAME'])
    const fromEmail = settings.SMTP_FROM_EMAIL || 'noreply@example.com'
    const fromName = settings.SMTP_FROM_NAME || 'SoftAcademy'

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = []
  const failed: string[] = []

  for (const recipient of recipients) {
    const sent = await sendEmail({ to: recipient, subject, html })
    if (sent) {
      success.push(recipient)
    } else {
      failed.push(recipient)
    }
  }

  return { success, failed }
}

export function createMeetLinkEmail(courseName: string, meetLink: string, startDate: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563EB; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SoftAcademy</h1>
        </div>
        <div class="content">
          <h2>თქვენი კურსის ლინკი</h2>
          <p>გამარჯობა!</p>
          <p>თქვენ დარეგისტრირდით კურსზე: <strong>${courseName}</strong></p>
          <p>კურსის დაწყების დრო: <strong>${startDate}</strong></p>
          <p>შეხვედრის ლინკი:</p>
          <a href="${meetLink}" class="button">შეუერთდი კურსს</a>
          <p>ან დააკოპირეთ ეს ლინკი: ${meetLink}</p>
        </div>
        <div class="footer">
          <p>SoftAcademy - ონლაინ კურსები</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function createPurchaseConfirmationEmail(
  userName: string,
  courseName: string,
  orderNumber: string,
  amount: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563EB; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SoftAcademy</h1>
        </div>
        <div class="content">
          <h2>შეკვეთა წარმატებით განთავსდა!</h2>
          <p>გამარჯობა, ${userName}!</p>
          <p>თქვენი შეკვეთა წარმატებით განთავსდა.</p>
          <div class="order-details">
            <p><strong>შეკვეთის ნომერი:</strong> ${orderNumber}</p>
            <p><strong>კურსი:</strong> ${courseName}</p>
            <p><strong>თანხა:</strong> ${amount}</p>
          </div>
          <p>კურსის ლინკი გამოგეგზავნებათ კურსის დაწყებამდე.</p>
        </div>
        <div class="footer">
          <p>SoftAcademy - ონლაინ კურსები</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function createOTPEmail(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563EB; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563EB; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SoftAcademy</h1>
        </div>
        <div class="content">
          <h2>ვერიფიკაციის კოდი</h2>
          <p>თქვენი ერთჯერადი კოდია:</p>
          <div class="otp-code">${otp}</div>
          <p>კოდი მოქმედებს 10 წუთის განმავლობაში.</p>
        </div>
        <div class="footer">
          <p>SoftAcademy - ონლაინ კურსები</p>
        </div>
      </div>
    </body>
    </html>
  `
}
