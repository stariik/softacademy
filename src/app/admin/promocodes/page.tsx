'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatDateShort } from '@/lib/utils'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface Promocode {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: string
  maxUses: number | null
  usedCount: number
  minPurchase: string | null
  expiresAt: string | null
  isActive: boolean
  _count: { orders: number }
}

export default function AdminPromocodesPage() {
  const { addToast } = useToast()
  const [promocodes, setPromocodes] = useState<Promocode[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: '',
    maxUses: '',
    minPurchase: '',
    expiresAt: '',
  })

  useEffect(() => {
    fetchPromocodes()
  }, [])

  const fetchPromocodes = async () => {
    try {
      const res = await fetch('/api/promocodes')
      const data = await res.json()
      setPromocodes(data.promocodes || [])
    } catch (error) {
      console.error('Failed to fetch promocodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/promocodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          type: formData.type,
          value: parseFloat(formData.value),
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
          minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : undefined,
          expiresAt: formData.expiresAt || undefined,
        }),
      })

      if (res.ok) {
        addToast('success', 'პრომოკოდი შეიქმნა')
        setModalOpen(false)
        setFormData({
          code: '',
          type: 'PERCENTAGE',
          value: '',
          maxUses: '',
          minPurchase: '',
          expiresAt: '',
        })
        fetchPromocodes()
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

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/promocodes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      })

      if (res.ok) {
        setPromocodes((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !isActive } : p))
        )
        addToast('success', !isActive ? 'პრომოკოდი გააქტიურდა' : 'პრომოკოდი გაითიშა')
      }
    } catch {
      addToast('error', 'შეცდომა')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ნამდვილად გსურთ პრომოკოდის წაშლა?')) return

    try {
      const res = await fetch(`/api/promocodes?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPromocodes((prev) => prev.filter((p) => p.id !== id))
        addToast('success', 'პრომოკოდი წაიშალა')
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
        <h1 className="text-3xl font-bold text-slate-800">პრომოკოდები</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          ახალი პრომოკოდი
        </Button>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-slate-500">სულ {promocodes.length} პრომოკოდი</p>
        </CardHeader>
        <CardContent>
          {promocodes.length === 0 ? (
            <p className="text-slate-500 text-center py-8">პრომოკოდები არ მოიძებნა</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">კოდი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ფასდაკლება</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">გამოყენება</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ვადა</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">სტატუსი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">მოქმედებები</th>
                  </tr>
                </thead>
                <tbody>
                  {promocodes.map((promo) => (
                    <tr key={promo.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {promo.code}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {promo.type === 'PERCENTAGE'
                          ? `${parseFloat(promo.value)}%`
                          : `${parseFloat(promo.value)} ₾`}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {promo.usedCount} / {promo.maxUses || '∞'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {promo.expiresAt ? formatDateShort(promo.expiresAt) : 'უვადო'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={promo.isActive ? 'success' : 'error'}>
                          {promo.isActive ? 'აქტიური' : 'გათიშული'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(promo.id, promo.isActive)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            {promo.isActive ? (
                              <ToggleRight className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ახალი პრომოკოდი"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="კოდი"
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
            }
            placeholder="PROMO2024"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="ტიპი"
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as 'PERCENTAGE' | 'FIXED',
                }))
              }
              options={[
                { value: 'PERCENTAGE', label: 'პროცენტი (%)' },
                { value: 'FIXED', label: 'ფიქსირებული (₾)' },
              ]}
            />
            <Input
              label={formData.type === 'PERCENTAGE' ? 'პროცენტი' : 'თანხა'}
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder={formData.type === 'PERCENTAGE' ? '10' : '20'}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="მაქს. გამოყენება"
              type="number"
              value={formData.maxUses}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxUses: e.target.value }))
              }
              placeholder="100"
            />
            <Input
              label="მინ. შესყიდვა (₾)"
              type="number"
              step="0.01"
              value={formData.minPurchase}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, minPurchase: e.target.value }))
              }
              placeholder="50"
            />
          </div>
          <Input
            label="ვადა"
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
            }
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={saving}>
              შექმნა
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
