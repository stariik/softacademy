import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/auth'

const ALLOWED_TYPES = ['application/pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'syllabus' or 'image'

    if (!file) {
      return NextResponse.json(
        { error: 'ფაილი არ არის მითითებული' },
        { status: 400 }
      )
    }

    // Validate file type for PDF
    if (type === 'syllabus' && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'მხოლოდ PDF ფაილებია დაშვებული' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = path.extname(file.name) || '.pdf'
    const sanitizedName = file.name
      .replace(extension, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 50)
    const filename = `${sanitizedName}-${timestamp}-${randomStr}${extension}`

    // Determine upload directory
    const uploadDir = type === 'syllabus'
      ? path.join(process.cwd(), 'public', 'uploads', 'syllabus')
      : path.join(process.cwd(), 'public', 'uploads', 'images')

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return public URL
    const publicUrl = type === 'syllabus'
      ? `/uploads/syllabus/${filename}`
      : `/uploads/images/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error('Upload error:', error)

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'არაავტორიზებული მოქმედება' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'ფაილის ატვირთვა ვერ მოხერხდა' },
      { status: 500 }
    )
  }
}
