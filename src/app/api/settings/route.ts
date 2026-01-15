import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()

    const settings = await prisma.settings.findMany()
    const result: Record<string, string> = {}
    settings.forEach((s) => {
      result[s.key] = s.value
    })

    return NextResponse.json({ settings: result })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()

    const operations = Object.entries(body)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) =>
        prisma.settings.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      )

    await prisma.$transaction(operations)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save settings error:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
