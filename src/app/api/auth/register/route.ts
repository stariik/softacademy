import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const { name, email, phone, password } = validatedData

    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json(
          { error: 'ეს ელ-ფოსტა უკვე დარეგისტრირებულია' },
          { status: 400 }
        )
      }
    }

    if (phone) {
      const existingUser = await prisma.user.findUnique({ where: { phone } })
      if (existingUser) {
        return NextResponse.json(
          { error: 'ეს ტელეფონის ნომერი უკვე დარეგისტრირებულია' },
          { status: 400 }
        )
      }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
      },
    })

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
    console.error('Registration error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'არასწორი მონაცემები' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'რეგისტრაციის შეცდომა' },
      { status: 500 }
    )
  }
}
