'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, Plus, X, Upload, FileText, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

export default function NewCoursePage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    description: '',
    price: '',
    categoryId: '',
    instructor: '',
    instructorBio: '',
    duration: '',
    startDate: '',
    maxStudents: '',
    isPublished: false,
    isFeatured: false,
  })

  const [syllabus, setSyllabus] = useState<string[]>([''])
  const [syllabusFile, setSyllabusFile] = useState<string | null>(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSyllabusChange = (index: number, value: string) => {
    setSyllabus((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const addSyllabusItem = () => {
    setSyllabus((prev) => [...prev, ''])
  }

  const removeSyllabusItem = (index: number) => {
    if (syllabus.length > 1) {
      setSyllabus((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      addToast('error', 'მხოლოდ PDF ფაილებია დაშვებული')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('error', 'ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს')
      return
    }

    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'syllabus')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setSyllabusFile(data.url)
        addToast('success', 'PDF წარმატებით აიტვირთა')
      } else {
        addToast('error', data.error || 'ფაილის ატვირთვა ვერ მოხერხდა')
      }
    } catch {
      addToast('error', 'ფაილის ატვირთვა ვერ მოხერხდა')
    } finally {
      setUploadingPdf(false)
    }
  }

  const removePdf = () => {
    setSyllabusFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
          syllabus: syllabus.filter((s) => s.trim()),
          syllabusFile: syllabusFile,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        addToast('success', 'კურსი წარმატებით შეიქმნა')
        router.push('/admin/courses')
      } else {
        addToast('error', data.error || 'შეცდომა კურსის შექმნისას')
      }
    } catch {
      addToast('error', 'შეცდომა კურსის შექმნისას')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/courses"
        className="flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        კურსებზე დაბრუნება
      </Link>

      <h1 className="text-3xl font-bold text-slate-800 mb-8">ახალი კურსი</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">ძირითადი ინფორმაცია</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="სათაური"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              label="მოკლე აღწერა"
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              required
            />
            <Textarea
              label="სრული აღწერა"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ფასი (₾)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Select
                label="კატეგორია"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="აირჩიეთ კატეგორია"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">ლექტორი</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="ლექტორის სახელი"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
            />
            <Textarea
              label="ლექტორის შესახებ"
              name="instructorBio"
              value={formData.instructorBio}
              onChange={handleChange}
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">კურსის დეტალები</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ხანგრძლივობა"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="მაგ: 2 საათი"
                required
              />
              <Input
                label="დაწყების თარიღი და დრო"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              label="მაქსიმალური სტუდენტების რაოდენობა"
              name="maxStudents"
              type="number"
              value={formData.maxStudents}
              onChange={handleChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-slate-800">სილაბუსი (თემები)</h2>
            <Button type="button" variant="ghost" size="sm" onClick={addSyllabusItem}>
              <Plus className="w-4 h-4 mr-1" />
              დამატება
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {syllabus.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-600">
                  {index + 1}
                </span>
                <Input
                  value={item}
                  onChange={(e) => handleSyllabusChange(index, e.target.value)}
                  placeholder={`თემა ${index + 1}`}
                  className="flex-1"
                />
                {syllabus.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSyllabusItem(index)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">სილაბუსი (PDF ფაილი)</h2>
            <p className="text-sm text-slate-500 mt-1">ატვირთეთ დეტალური სილაბუსი PDF ფორმატში</p>
          </CardHeader>
          <CardContent>
            {syllabusFile ? (
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">სილაბუსი.pdf</p>
                    <a
                      href={syllabusFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      ნახვა
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingPdf ? (
                    <>
                      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3" />
                      <p className="text-sm text-slate-500">იტვირთება...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="mb-2 text-sm text-slate-500">
                        <span className="font-semibold text-primary-600">აირჩიეთ ფაილი</span> ან ჩააგდეთ აქ
                      </p>
                      <p className="text-xs text-slate-400">PDF (მაქს. 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  disabled={uploadingPdf}
                />
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">პუბლიკაცია</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-slate-700">გამოქვეყნება</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-slate-700">გამორჩეული კურსი</span>
            </label>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" isLoading={loading}>
            შენახვა
          </Button>
          <Link href="/admin/courses">
            <Button type="button" variant="ghost">
              გაუქმება
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
