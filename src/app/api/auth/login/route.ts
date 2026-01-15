import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    const { identifier, password } = validatedData

    const isEmail = identifier.includes('@')
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: identifier }
        : { phone: identifier },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'არასწორი მონაცემები' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'არასწორი მონაცემები' },
        { status: 401 }
      )
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'შესვლის შეცდომა' },
      { status: 500 }
    )
  }
}
