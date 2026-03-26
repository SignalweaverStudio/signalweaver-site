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
            <a 
              href="https://github.com/SignalweaverStudio/signalweaver" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Button variant="outline" size="sm" asChild>
              <a href="#early-access">Get Early Access</a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm" style={{ borderColor: "rgba(0, 200, 180, 0.3)", color: "rgb(0, 200, 180)" }}>
              Open Source - v0.1.0
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Deterministic Policy Governance
              <br />
              <span className="text-gradient">for AI Agents</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Every AI action evaluated against policy. Every decision traced. 
              Every outcome replayable. Built for EU AI Act compliance and enterprise trust.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild style={{ backgroundColor: "rgb(0, 200, 180)", color: "#0c1014" }}>
                <a href="#early-access">
                  Request Early Access
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-white border-white/20" asChild>
                <a href="https://github.com/SignalweaverStudio/signalweaver" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Demo Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">
            See It In Action
          </h2>
          <p className="text-slate-600">
            Interactive preview based on the live SignalWeaver demo flow.
          </p>
        </div>

        <DemoWidget />
      </section>
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
                <span className="font-semibold text-white">EU AI Act Ready</span>
              </div>
              <p className="text-sm text-gray-400">Built for compliance mandates</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FileSearch className="w-5 h-5 mr-2" style={{ color: "rgb(0, 200, 180)" }} />
                <span className="font-semibold text-white">Full Traceability</span>
              </div>
              <p className="text-sm text-gray-400">Every decision auditable</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 mr-2" style={{ color: "rgb(0, 200, 180)" }} />
                <span className="font-semibold text-white">Counterfactual Replay</span>
              </div>
              <p className="text-sm text-gray-400">Simulate policy changes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24" style={{ backgroundColor: "rgba(30, 38, 46, 0.3)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              The Problem in One Sentence
            </h2>
            <p className="text-xl text-gray-400">
              AI agents make decisions that cannot be audited, traced, or governed - 
              and regulators are now demanding answers that model-based systems cannot provide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card style={{ backgroundColor: "rgba(180, 60, 60, 0.1)", borderColor: "rgba(180, 60, 60, 0.3)" }}>
              <CardHeader>
                <CardTitle className="text-lg text-white">No Audit Trail</CardTitle>
                <CardDescription className="text-gray-400">
                  Neural networks are black boxes. When something goes wrong, there is no way to reconstruct why.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card style={{ backgroundColor: "rgba(180, 60, 60, 0.1)", borderColor: "rgba(180, 60, 60, 0.3)" }}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Compliance Gap</CardTitle>
                <CardDescription className="text-gray-400">
                  EU AI Act requires explainability and human oversight. Most AI systems cannot provide either.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card style={{ backgroundColor: "rgba(180, 60, 60, 0.1)", borderColor: "rgba(180, 60, 60, 0.3)" }}>
              <CardHeader>
                <CardTitle className="text-lg text-white">No Policy Simulation</CardTitle>
                <CardDescription className="text-gray-400">
                  Cannot test "what if we changed the rules" without retraining entire models.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Core Primitives
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Five building blocks that work together to govern AI agent behavior with mathematical certainty.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="glow-teal hover:border-cyan-500/50 transition-colors" style={{ backgroundColor: "rgba(30, 38, 46, 1)" }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(0, 200, 180, 0.1)" }}>
                  <Shield className="w-6 h-6" style={{ color: "rgb(0, 200, 180)" }} />
                </div>
                <CardTitle className="text-white">Truth Anchors</CardTitle>
                <CardDescription className="text-gray-400">
                  Policy rules that cannot drift or degrade over time. Deterministic by design.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Immutable policy definitions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Version-controlled rules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    No model training required
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:border-cyan-500/50 transition-colors" style={{ backgroundColor: "rgba(30, 38, 46, 1)" }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(0, 200, 180, 0.1)" }}>
                  <Zap className="w-6 h-6" style={{ color: "rgb(0, 200, 180)" }} />
                </div>
                <CardTitle className="text-white">Gate Engine</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time action evaluation. Every agent request passes through policy gates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Allow, deny, or modify actions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Sub-millisecond evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Context-aware decisions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:border-cyan-500/50 transition-colors" style={{ backgroundColor: "rgba(30, 38, 46, 1)" }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(0, 200, 180, 0.1)" }}>
                  <FileSearch className="w-6 h-6" style={{ color: "rgb(0, 200, 180)" }} />
                </div>
                <CardTitle className="text-white">Decision Trace</CardTitle>
                <CardDescription className="text-gray-400">
                  Complete audit trail of every decision, with inputs, rules applied, and outcomes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Tamper-proof logs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Queryable history
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Export for auditors
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:border-cyan-500/50 transition-colors" style={{ backgroundColor: "rgba(30, 38, 46, 1)" }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(0, 200, 180, 0.1)" }}>
                  <RotateCcw className="w-6 h-6" style={{ color: "rgb(0, 200, 180)" }} />
                </div>
                <CardTitle className="text-white">Replay</CardTitle>
                <CardDescription className="text-gray-400">
                  Re-execute past decisions to verify behavior or reproduce issues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Exact state reconstruction
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Debug production issues
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                    Verify compliance retroactively
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 glow-teal" style={{ backgroundColor: "rgba(0, 200, 180, 0.05)", borderColor: "rgba(0, 200, 180, 0.3)" }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(0, 200, 180, 0.2)" }}>
                  <GitBranch className="w-6 h-6" style={{ color: "rgb(0, 200, 180)" }} />
                </div>
                <CardTitle className="text-white">Counterfactual Replay</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  The competitive moat. Simulate how policy changes would have affected historical decisions - 
                  impossible with model-based approaches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                      Test policy changes before deployment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                      Measure impact on past decisions
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                      A/B test governance strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "rgb(0, 200, 180)" }} />
                      Prove compliance to regulators
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24" style={{ backgroundColor: "rgba(30, 38, 46, 0.3)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Three steps from chaos to compliance
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ backgroundColor: "rgba(0, 200, 180, 0.1)", color: "rgb(0, 200, 180)" }}>
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Define Policies</h3>
                <p className="text-gray-400">
                  Write Truth Anchors in declarative YAML. Version control with Git.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ backgroundColor: "rgba(0, 200, 180, 0.1)", color: "rgb(0, 200, 180)" }}>
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Connect Agents</h3>
                <p className="text-gray-400">
                  Route AI agent actions through the Gate Engine API.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ backgroundColor: "rgba(0, 200, 180, 0.1)", color: "rgb(0, 200, 180)" }}>
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Audit and Simulate</h3>
                <p className="text-gray-400">
                  Query decision traces. Run counterfactuals. Prove compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="early-access" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card className="glow-teal" style={{ borderColor: "rgba(0, 200, 180, 0.3)" }}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Get Early Access</CardTitle>
                <CardDescription className="text-base text-gray-400">
                  SignalWeaver is currently in private beta. Request access to evaluate it for your AI governance needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: "rgb(0, 200, 180)" }} />
                    <h3 className="text-xl font-semibold mb-2 text-white">Request Received</h3>
                    <p className="text-gray-400">
                      We will be in touch soon. In the meantime, explore the{" "}
                      <a 
                        href="https://github.com/SignalweaverStudio/signalweaver" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: "rgb(0, 200, 180)" }}
                      >
                        GitHub repository
                      </a>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-300">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-300">
                        Work Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-300">
                        What are you looking to govern? <span className="text-gray-500">(optional)</span>
                      </label>
                      <Textarea
                        id="message"
                        placeholder="e.g., Customer service AI agents, internal automation tools..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    {submitError && (
                      <p className="text-sm text-red-400">{submitError}</p>
                    )}
                    <Button type="submit" className="w-full" size="lg" disabled={submitting} style={{ backgroundColor: "rgb(0, 200, 180)", color: "#0c1014" }}>
                      {submitting ? "Sending..." : "Request Access"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 200, 180, 0.2)" }}>
                <Shield className="w-5 h-5" style={{ color: "rgb(0, 200, 180)" }} />
              </div>
              <span className="font-semibold text-white">SignalWeaver</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a 
                href="https://github.com/SignalweaverStudio/signalweaver" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#early-access" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
            
            <div className="text-sm text-gray-400">
              2025 SignalWeaver. Open source under MIT.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
