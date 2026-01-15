import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { promocodeSchema } from '@/lib/validations'

export async function GET() {
  try {
    await requireAdmin()

    const promocodes = await prisma.promocode.findMany({
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ promocodes })
  } catch (error) {
    console.error('Get promocodes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promocodes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = promocodeSchema.parse(body)

    const existingCode = await prisma.promocode.findUnique({
      where: { code: validatedData.code },
    })

    if (existingCode) {
      return NextResponse.json(
        { error: 'ეს კოდი უკვე არსებობს' },
        { status: 400 }
      )
    }

    const promocode = await prisma.promocode.create({
      data: {
        code: validatedData.code,
        type: validatedData.type,
        value: validatedData.value,
        maxUses: validatedData.maxUses,
        minPurchase: validatedData.minPurchase,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
    })

    return NextResponse.json({ promocode })
  } catch (error) {
    console.error('Create promocode error:', error)
    return NextResponse.json(
      { error: 'Failed to create promocode' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const { id, isActive } = await request.json()

    const promocode = await prisma.promocode.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json({ promocode })
  } catch (error) {
    console.error('Update promocode error:', error)
    return NextResponse.json(
      { error: 'Failed to update promocode' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Promocode ID required' },
        { status: 400 }
      )
    }

    await prisma.promocode.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete promocode error:', error)
    return NextResponse.json(
      { error: 'Failed to delete promocode' },
      { status: 500 }
    )
  }
}
