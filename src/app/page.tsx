"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import DemoWidget from '@/components/DemoWidget';
import { 
  Shield, 
  GitBranch, 
  FileSearch, 
  RotateCcw, 
  Zap,
  Github,
  ArrowRight,
  CheckCircle2,
  Lock,
  Scale,
  Clock
} from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error("Request failed")
      setSubmitted(true)
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: "rgba(18, 22, 26, 0.8)" }}>
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 200, 180, 0.2)" }}>
              <Shield className="w-5 h-5" style={{ color: "rgb(0, 200, 180)" }} />
            </div>
            <span className="font-semibold text-lg text-white">SignalWeaver</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/SignalweaverStudio/signalweaver" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <Button variant="outline" size="sm" asChild>
              <a href="#early-access">Get Early Access</a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-white/10" style={{ backgroundColor: "rgba(30, 38, 46, 0.5)" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Lock className="w-5 h-5 mr-2" style={{ color: "rgb(0, 200, 180)" }} />
                <span className="font-semibold text-white">Deterministic</span>
              </div>
              <p className="text-sm text-gray-400">Same input, same output. Always.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Scale className="w-5 h-5 mr-2" style={{ color: "rgb(0, 200, 180)" }} />
                <span className="font-semibold text-white">Model-Agnostic</span>
              </div>
              <p className="text-sm text-gray-400">Works with any AI system. No retraining required.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
