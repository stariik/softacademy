import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { otpSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, email, otp } = body

    const validatedOTP = otpSchema.parse({ otp })

    let user
    if (phone) {
      user = await prisma.user.findUnique({
        where: { phone },
      })
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'მომხმარებელი ვერ მოიძებნა' },
        { status: 404 }
      )
    }

    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        userId: user.id,
        code: validatedOTP.otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'არასწორი ან ვადაგასული კოდი' },
        { status: 400 }
      )
    }

    await prisma.oTPCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    })

    if (otpRecord.type === 'PHONE_VERIFY') {
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true },
      })
    } else if (otpRecord.type === 'EMAIL_VERIFY') {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      })
    }

    const token = generateToken({
      userId: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })

    const cookieHeader = setAuthCookie(token)
    response.headers.set('Set-Cookie', cookieHeader['Set-Cookie'])

    return response
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'კოდის დადასტურების შეცდომა' },
      { status: 500 }
    )
  }
}
