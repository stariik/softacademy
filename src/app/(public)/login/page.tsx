import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import { GraduationCap, BookOpen, Users, Award, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'შესვლა',
}

const features = [
  { icon: BookOpen, text: '50+ პროფესიონალური კურსი' },
  { icon: Users, text: '1000+ კმაყოფილი სტუდენტი' },
  { icon: Award, text: 'სერთიფიცირებული პროგრამა' },
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        {/* Content */}
        <div className="relative flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SoftAcademy</span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            კეთილი იყოს{' '}
            <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              შენი დაბრუნება
            </span>
          </h1>

          <p className="text-lg text-slate-300 mb-12 max-w-md">
            შედი შენს ანგარიშზე და გააგრძელე სწავლა იქიდან, სადაც შეჩერდი
          </p>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-12 right-12 flex items-center gap-2 text-slate-500 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>გახდი უკეთესი ყოველდღე</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-800">SoftAcademy</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">შესვლა</h2>
            <p className="text-slate-500">
              შედით თქვენს ანგარიშზე კურსებზე წვდომისთვის
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <LoginForm />
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500">
            ანგარიშზე შესვლით თქვენ ეთანხმებით ჩვენს{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">
              პირობებს
            </Link>{' '}
            და{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              კონფიდენციალურობის პოლიტიკას
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
