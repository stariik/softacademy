'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { PageSpinner } from '@/components/ui/Spinner'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  _count: { courses: number }
}

export default function AdminCategoriesPage() {
  const { addToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

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
    } finally {
      setLoading(false)
    }
  }

  const openModal = (category?: Category) => {
    if (category) {
      setEditing(category)
      setFormData({ name: category.name, description: category.description || '' })
    } else {
      setEditing(null)
      setFormData({ name: '', description: '' })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editing ? `/api/categories/${editing.id}` : '/api/categories'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        addToast('success', editing ? 'კატეგორია განახლდა' : 'კატეგორია შეიქმნა')
        setModalOpen(false)
        fetchCategories()
      } else {
        const data = await res.json()
        addToast('error', data.error || 'შეცდომა')
      }
    } catch {
      addToast('error', 'შეცდომა')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ნამდვილად გსურთ კატეგორიის წაშლა?')) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        addToast('success', 'კატეგორია წაიშალა')
      } else {
        addToast('error', 'შეცდომა კატეგორიის წაშლისას')
      }
    } catch {
      addToast('error', 'შეცდომა')
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">კატეგორიები</h1>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          ახალი კატეგორია
        </Button>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-slate-500">სულ {categories.length} კატეგორია</p>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-slate-500 text-center py-8">კატეგორიები არ მოიძებნა</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-800">{category.name}</p>
                    <p className="text-sm text-slate-500">
                      {category._count.courses} კურსი
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(category)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={category._count.courses > 0}
                    >
                      <Trash2 className={`w-4 h-4 ${
                        category._count.courses > 0 ? 'text-slate-300' : 'text-red-500'
                      }`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'კატეგორიის რედაქტირება' : 'ახალი კატეგორია'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="სახელი"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="აღწერა"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={saving}>
              შენახვა
            </Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              გაუქმება
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
