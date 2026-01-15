import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'
import { sendEmail, createPurchaseConfirmationEmail } from '@/lib/email'

export async function GET(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        course: { select: { title: true, slug: true } },
        promocode: { select: { code: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { courseId, promocode } = await request.json()

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'კურსი ვერ მოიძებნა' },
        { status: 404 }
      )
    }

    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        courseId,
        status: { in: ['PENDING', 'COMPLETED'] },
      },
    })

    if (existingOrder) {
      return NextResponse.json(
        { error: 'თქვენ უკვე შეიძინეთ ეს კურსი' },
        { status: 400 }
      )
    }

    let discount = 0
    let promocodeId: string | null = null

    if (promocode) {
      const promoRecord = await prisma.promocode.findUnique({
        where: { code: promocode.toUpperCase() },
      })

      if (promoRecord && promoRecord.isActive) {
        if (promoRecord.expiresAt && promoRecord.expiresAt < new Date()) {
          return NextResponse.json(
            { error: 'პრომოკოდს ვადა გაუვიდა' },
            { status: 400 }
          )
        }

        if (promoRecord.maxUses && promoRecord.usedCount >= promoRecord.maxUses) {
          return NextResponse.json(
            { error: 'პრომოკოდი ამოწურულია' },
            { status: 400 }
          )
        }

        if (promoRecord.minPurchase && course.price.toNumber() < promoRecord.minPurchase.toNumber()) {
          return NextResponse.json(
            { error: `მინიმალური შეძენა: ${promoRecord.minPurchase}` },
            { status: 400 }
          )
        }

        if (promoRecord.type === 'PERCENTAGE') {
          discount = (course.price.toNumber() * promoRecord.value.toNumber()) / 100
        } else {
          discount = promoRecord.value.toNumber()
        }

        promocodeId = promoRecord.id

        await prisma.promocode.update({
          where: { id: promoRecord.id },
          data: { usedCount: { increment: 1 } },
        })
      }
    }

    const amount = course.price.toNumber()
    const finalAmount = Math.max(0, amount - discount)

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: 'COMPLETED',
        amount,
        discount,
        finalAmount,
        userId: user.id,
        courseId,
        promocodeId,
      },
      include: {
        course: true,
        user: true,
      },
    })

    if (order.user.email) {
      await sendEmail({
        to: order.user.email,
        subject: `შეკვეთა #${order.orderNumber} - SoftAcademy`,
        html: createPurchaseConfirmationEmail(
          order.user.name,
          order.course.title,
          order.orderNumber,
          `${finalAmount} ₾`
        ),
      })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const { id, status } = await request.json()

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
