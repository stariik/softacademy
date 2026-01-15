'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  BookOpen,
  CheckCircle,
} from 'lucide-react'

export default function ContactPage() {
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        success('შეტყობინება წარმატებით გაიგზავნა!', 'მადლობა დაკავშირებისთვის')
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch {
      error('შეცდომა შეტყობინების გაგზავნისას', 'გთხოვთ სცადოთ თავიდან')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'ელ-ფოსტა',
      value: 'info@softacademy.ge',
      href: 'mailto:info@softacademy.ge',
      description: 'მოგვწერეთ ნებისმიერ დროს',
    },
    {
      icon: Phone,
      title: 'ტელეფონი',
      value: '+995 555 123 456',
      href: 'tel:+995555123456',
      description: 'ორშ-პარ: 10:00 - 19:00',
    },
    {
      icon: MapPin,
      title: 'მისამართი',
      value: 'თბილისი, საქართველო',
      description: 'ვაკე, ჭავჭავაძის გამზ. 1',
    },
    {
      icon: Clock,
      title: 'სამუშაო საათები',
      value: 'ორშ-პარ: 10:00 - 19:00',
      description: 'შაბ: 11:00 - 16:00',
    },
  ]

  const features = [
    {
      icon: MessageSquare,
      title: 'სწრაფი პასუხი',
      description: 'ჩვენ ვცდილობთ უპასუხოთ 24 საათის განმავლობაში',
    },
    {
      icon: Headphones,
      title: 'პროფესიონალური მხარდაჭერა',
      description: 'ჩვენი გუნდი მზადაა დაგეხმაროთ ნებისმიერ საკითხში',
    },
    {
      icon: BookOpen,
      title: 'დეტალური კონსულტაცია',
      description: 'მიიღეთ რჩევები თქვენთვის შესაფერისი კურსის შერჩევაში',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 lg:py-28 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-hero-pattern" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full',
              'bg-white/10 backdrop-blur-sm border border-white/20',
              'text-white/90 text-sm font-medium mb-6'
            )}>
              <MessageSquare className="w-4 h-4" />
              <span>დაგვიკავშირდით</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              გაქვთ კითხვები?
              <span className="block text-primary-200">ჩვენ აქ ვართ დასახმარებლად</span>
            </h1>

            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              შეავსეთ ფორმა ან დაგვიკავშირდით პირდაპირ. ჩვენი გუნდი მზადაა უპასუხოს
              თქვენს ნებისმიერ შეკითხვას კურსების, გადახდის ან სხვა საკითხების შესახებ.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative -mt-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item) => (
              <Card
                key={item.title}
                variant="elevated"
                className="group hover:border-primary-200 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className={cn(
                    'w-12 h-12 rounded-xl mb-4',
                    'bg-gradient-to-br from-primary-50 to-primary-100',
                    'flex items-center justify-center',
                    'group-hover:scale-110 transition-transform duration-300'
                  )}>
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-primary-600 font-medium hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-900 font-medium">{item.value}</p>
                  )}
                  <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card variant="elevated" className="overflow-visible">
                <CardContent className="p-8 lg:p-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    მოგვწერეთ შეტყობინება
                  </h2>
                  <p className="text-slate-500 mb-8">
                    შეავსეთ ფორმა და ჩვენ დაგიკავშირდებით უმოკლეს დროში
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="სახელი და გვარი"
                        placeholder="თქვენი სახელი"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <Input
                        label="ელ-ფოსტა"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <Textarea
                      label="შეტყობინება"
                      placeholder="დაწერეთ თქვენი შეტყობინება..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[180px]"
                    />

                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isSubmitting}
                      rightIcon={<Send className="w-5 h-5" />}
                      className="w-full sm:w-auto"
                    >
                      შეტყობინების გაგზავნა
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Features */}
              <div className="space-y-4">
                {features.map((feature) => (
                  <Card key={feature.title} hover className="group">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-lg shrink-0',
                        'bg-gradient-to-br from-primary-50 to-primary-100',
                        'flex items-center justify-center',
                        'group-hover:scale-110 transition-transform duration-300'
                      )}>
                        <feature.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-500">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* FAQ Teaser */}
              <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    ხშირად დასმული კითხვები
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'როგორ შევიძინო კურსი?',
                      'როგორ მივიღო Google Meet ლინკი?',
                      'შესაძლებელია თანხის დაბრუნება?',
                    ].map((question) => (
                      <li key={question} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                        <span className="text-slate-600">{question}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="mt-4 text-primary-600">
                    ყველა კითხვის ნახვა
                  </Button>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-slate-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">რუკის ჩატვირთვა...</p>
                    </div>
                  </div>
                  {/* You can add actual map embed here */}
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600">
                    <strong>მისამართი:</strong> თბილისი, ვაკე, ჭავჭავაძის გამზ. 1
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
