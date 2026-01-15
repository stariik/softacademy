import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await requireAuth()
    const { code, coursePrice } = await request.json()

    const promocode = await prisma.promocode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promocode) {
      return NextResponse.json(
        { error: 'პრომოკოდი ვერ მოიძებნა' },
        { status: 404 }
      )
    }

    if (!promocode.isActive) {
      return NextResponse.json(
        { error: 'პრომოკოდი არ არის აქტიური' },
        { status: 400 }
      )
    }

    if (promocode.expiresAt && promocode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'პრომოკოდს ვადა გაუვიდა' },
        { status: 400 }
      )
    }

    if (promocode.maxUses && promocode.usedCount >= promocode.maxUses) {
      return NextResponse.json(
        { error: 'პრომოკოდი ამოწურულია' },
        { status: 400 }
      )
    }

    if (promocode.minPurchase && coursePrice < promocode.minPurchase.toNumber()) {
      return NextResponse.json(
        { error: `მინიმალური შეძენა: ${promocode.minPurchase} ₾` },
        { status: 400 }
      )
    }

    let discount: number
    if (promocode.type === 'PERCENTAGE') {
      discount = (coursePrice * promocode.value.toNumber()) / 100
    } else {
      discount = promocode.value.toNumber()
    }

    return NextResponse.json({
      valid: true,
      promocode: {
        code: promocode.code,
        type: promocode.type,
        value: promocode.value,
        discount,
      },
    })
  } catch (error) {
    console.error('Validate promocode error:', error)
    return NextResponse.json(
      { error: 'Failed to validate promocode' },
      { status: 500 }
    )
  }
}
