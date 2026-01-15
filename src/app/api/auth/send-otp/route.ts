import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP } from '@/lib/utils'
import { sendSMS } from '@/lib/sms'
import { sendEmail, createOTPEmail } from '@/lib/email'
import { phoneLoginSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, email, type = 'LOGIN' } = body

    let user

    if (phone) {
      const validatedData = phoneLoginSchema.parse({ phone })
      user = await prisma.user.findUnique({
        where: { phone: validatedData.phone },
      })

      if (!user && type === 'LOGIN') {
        return NextResponse.json(
          { error: 'მომხმარებელი ვერ მოიძებნა' },
          { status: 404 }
        )
      }
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user && type === 'LOGIN') {
        return NextResponse.json(
          { error: 'მომხმარებელი ვერ მოიძებნა' },
          { status: 404 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'გთხოვთ მიუთითოთ ტელეფონი ან ელ-ფოსტა' },
        { status: 400 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'მომხმარებელი ვერ მოიძებნა' },
        { status: 404 }
      )
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.oTPCode.create({
      data: {
        code: otp,
        type,
        expiresAt,
        userId: user.id,
      },
    })

    if (phone) {
      const message = `თქვენი კოდია: ${otp}. კოდი მოქმედებს 10 წუთის განმავლობაში.`
      await sendSMS(phone, message)
    } else if (email) {
      await sendEmail({
        to: email,
        subject: 'ვერიფიკაციის კოდი - SoftAcademy',
        html: createOTPEmail(otp),
      })
    }

    return NextResponse.json({
      success: true,
      message: phone ? 'კოდი გაიგზავნა SMS-ით' : 'კოდი გაიგზავნა ელ-ფოსტაზე',
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'კოდის გაგზავნის შეცდომა' },
      { status: 500 }
    )
  }
}
