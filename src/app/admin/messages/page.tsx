'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { PageSpinner } from '@/components/ui/Spinner'
import { Mail, MessageSquare, Users, Send, Check } from 'lucide-react'

interface CourseBuyer {
  id: string
  name: string
  email: string | null
  phone: string | null
  courseTitle: string
}

export default function AdminMessagesPage() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [buyers, setBuyers] = useState<CourseBuyer[]>([])
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([])
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email')

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  })

  useEffect(() => {
    fetchBuyers()
  }, [])

  const fetchBuyers = async () => {
    try {
      const res = await fetch('/api/admin/buyers')
      const data = await res.json()
      setBuyers(data.buyers || [])
    } catch (error) {
      console.error('Failed to fetch buyers:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBuyer = (id: string) => {
    setSelectedBuyers((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    const eligibleBuyers = buyers.filter((b) =>
      messageType === 'email' ? b.email : b.phone
    )
    setSelectedBuyers(eligibleBuyers.map((b) => b.id))
  }

  const deselectAll = () => {
    setSelectedBuyers([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedBuyers.length === 0) {
      addToast('error', 'აირჩიეთ მინიმუმ 1 მიმღები')
      return
    }

    const selectedUsers = buyers.filter((b) => selectedBuyers.includes(b.id))
    const recipients = selectedUsers
      .map((u) => (messageType === 'email' ? u.email : u.phone))
      .filter(Boolean) as string[]

    if (recipients.length === 0) {
      addToast('error', `არჩეულ მომხმარებლებს არ აქვთ ${messageType === 'email' ? 'ელ-ფოსტა' : 'ტელეფონი'}`)
      return
    }

    setSending(true)

    try {
      const res = await fetch(`/api/messages/${messageType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: formData.subject,
          content: formData.content,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        addToast('success', `შეტყობინება გაიგზავნა ${data.success?.length || recipients.length} მიმღებზე`)
        setFormData({ subject: '', content: '' })
        setSelectedBuyers([])
      } else {
        addToast('error', data.error || 'შეცდომა შეტყობინების გაგზავნისას')
      }
    } catch {
      addToast('error', 'შეცდომა')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  const eligibleBuyers = buyers.filter((b) =>
    messageType === 'email' ? b.email : b.phone
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">შეტყობინებები</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recipients Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-slate-800">მიმღებები</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  ყველას მონიშვნა
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  გასუფთავება
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMessageType('email')
                  setSelectedBuyers([])
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  messageType === 'email'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                ელ-ფოსტა
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessageType('sms')
                  setSelectedBuyers([])
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  messageType === 'sms'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </button>
            </div>

            {eligibleBuyers.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                {messageType === 'email'
                  ? 'მომხმარებლები ელ-ფოსტით არ მოიძებნა'
                  : 'მომხმარებლები ტელეფონით არ მოიძებნა'}
              </p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {eligibleBuyers.map((buyer) => (
                  <label
                    key={buyer.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedBuyers.includes(buyer.id)
                        ? 'bg-primary-50 border border-primary-200'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      selectedBuyers.includes(buyer.id)
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-slate-300'
                    }`}>
                      {selectedBuyers.includes(buyer.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedBuyers.includes(buyer.id)}
                      onChange={() => toggleBuyer(buyer.id)}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{buyer.name}</p>
                      <p className="text-sm text-slate-500 truncate">
                        {messageType === 'email' ? buyer.email : buyer.phone}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{buyer.courseTitle}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm text-slate-500">
              არჩეულია: {selectedBuyers.length} / {eligibleBuyers.length}
            </p>
          </CardContent>
        </Card>

        {/* Message Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {messageType === 'email' ? (
                <Mail className="w-5 h-5 text-primary-600" />
              ) : (
                <MessageSquare className="w-5 h-5 text-primary-600" />
              )}
              <h2 className="font-semibold text-slate-800">
                {messageType === 'email' ? 'ელ-ფოსტა' : 'SMS შეტყობინება'}
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {messageType === 'email' && (
                <Input
                  label="თემა"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="შეტყობინების თემა"
                  required
                />
              )}
              <Textarea
                label={messageType === 'email' ? 'შეტყობინება' : 'SMS ტექსტი'}
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={messageType === 'email' ? 10 : 4}
                placeholder={
                  messageType === 'email'
                    ? 'ჩაწერეთ შეტყობინების ტექსტი...'
                    : 'ჩაწერეთ SMS ტექსტი (მაქს. 160 სიმბოლო)...'
                }
                maxLength={messageType === 'sms' ? 160 : undefined}
                required
              />
              {messageType === 'sms' && (
                <p className="text-sm text-slate-500">
                  {formData.content.length} / 160 სიმბოლო
                </p>
              )}
              <Button
                type="submit"
                isLoading={sending}
                disabled={selectedBuyers.length === 0}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                გაგზავნა ({selectedBuyers.length} მიმღები)
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
