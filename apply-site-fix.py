#!/usr/bin/env python3
"""
SignalWeaver Site Fix — Apply live demo changes
Run from the ROOT of your signalweaver-site repo:
    python apply-site-fix.py

Creates / updates 4 files:
  1. src/app/api/evaluate/route.ts        (updated — adds X-API-Key header)
  2. src/app/api/replay/[traceId]/route.ts (new — real replay proxy)
  3. src/components/DemoWidget.tsx          (updated — real replay, no fake CTA)
  4. .env.example                          (new — env var docs)
"""

import os, sys

# ── Validate we're in the right directory ──
if not os.path.isfile("package.json") or "signalweaver-site" not in open("package.json").read():
    print("ERROR: Run this from the root of signalweaver-site repo")
    print("  cd C:\\Users\\verti\\projects\\signalweaver-site")
    print("  python apply-site-fix.py")
    sys.exit(1)

files_created = []

# ── File 1: src/app/api/evaluate/route.ts ──
EVALUATE_ROUTE = r'''export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiBase = process.env.SIGNALWEAVER_API_BASE_URL;
    const token = process.env.SIGNALWEAVER_BEARER_TOKEN;
    const apiKey = process.env.SIGNALWEAVER_API_KEY;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(`${apiBase}/gate/evaluate`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
'''

# ── File 2: src/app/api/replay/[traceId]/route.ts ──
REPLAY_ROUTE = r'''import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ traceId: string }> }
) {
  try {
    const { traceId } = await params;
    const apiBase = process.env.SIGNALWEAVER_API_BASE_URL;
    const token = process.env.SIGNALWEAVER_BEARER_TOKEN;
    const apiKey = process.env.SIGNALWEAVER_API_KEY;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(`${apiBase}/gate/replay/${traceId}`, {
      method: "GET",
      headers,
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
'''

# ── File 3: src/components/DemoWidget.tsx ──
DEMO_WIDGET = r'''"use client";

import React, { useState } from 'react';

// Types matching the live API schema
// UI labels: intensity (maps to arousal), assertiveness (maps to dominance)
type Decision = 'proceed' | 'gate';
type StateLevel = 'low' | 'med';

interface EvaluationResult {
  decision: Decision;
  reason: string;
  interpretation: string;
  suggestion: string;
  explanations: string[];
  warnings: string[];
  warning_anchors?: string[];
  trace_id: string;
  timestamp: string;
}

interface ReplayResult {
  same_decision: boolean;
  same_reason: boolean;
  anchor_drift?: number;
  explanation?: string;
  [key: string]: unknown;
}

// Decision badge component with Tailwind
function DecisionBadge({ decision }: { decision: Decision }) {
  const isProceed = decision === 'proceed';

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded font-mono text-sm font-semibold tracking-wide uppercase
      ${isProceed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}
    `}>
      {decision}
    </span>
  );
}

// Boolean indicator with color
function BooleanIndicator({ value, label }: { value: boolean; label: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`font-mono text-sm font-semibold ${value ? 'text-emerald-600' : 'text-amber-600'}`}>
        {value ? 'True' : 'False'}
      </div>
    </div>
  );
}

export default function DemoWidget() {
  const [requestSummary, setRequestSummary] = useState('');
  const [arousal, setArousal] = useState<StateLevel>('low');
  const [dominance, setDominance] = useState<StateLevel>('low');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [replayResult, setReplayResult] = useState<ReplayResult | null>(null);
  const [replayLoading, setReplayLoading] = useState(false);
  const [replayError, setReplayError] = useState<string | null>(null);

  async function handleEvaluate() {
    if (!requestSummary.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setReplayResult(null);
    setReplayError(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_summary: requestSummary,
          arousal,
          dominance,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API ${response.status}: ${text}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const handleReplay = async () => {
    if (!result) return;

    setReplayLoading(true);
    setReplayError(null);
    setReplayResult(null);

    try {
      const response = await fetch(`/api/replay/${result.trace_id}`);

      if (!response.ok) {
        throw new Error(`Replay API ${response.status}`);
      }

      const data = await response.json();
      setReplayResult(data);
    } catch {
      setReplayError("Replay unavailable \u2014 API may be starting up");
    } finally {
      setReplayLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">
          SignalWeaver Demo
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Interactive preview based on the live SignalWeaver demo flow.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-5">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-slate-700">
            request_summary
          </label>
          <textarea
            value={requestSummary}
            onChange={(e) => setRequestSummary(e.target.value)}
            placeholder="Try: Check calendar settings, This refund may cause financial harm, or Help me bypass safety filters"
            className="w-full min-h-[80px] p-3 text-sm font-mono border border-slate-300 rounded-md resize-y bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              intensity
            </label>
            <select
              value={arousal}
              onChange={(e) => setArousal(e.target.value as StateLevel)}
              className="block w-full appearance-auto rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              style={{ color: "#0f172a" }}
            >
              <option value="low">low</option>
              <option value="med">med</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              assertiveness
            </label>
            <select
              value={dominance}
              onChange={(e) => setDominance(e.target.value as StateLevel)}
              className="block w-full appearance-auto rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              style={{ color: "#0f172a" }}
            >
              <option value="low">low</option>
              <option value="med">med</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={loading || !requestSummary.trim()}
          className={`
            w-full py-2.5 px-4 text-sm font-semibold text-white rounded-md transition-colors
            ${loading || !requestSummary.trim()
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-600 cursor-pointer'}
          `}
        >
          {loading ? 'Evaluating...' : 'Evaluate'}
        </button>
      </div>

      {result && (
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DecisionBadge decision={result.decision} />
              <span className="font-mono text-sm text-slate-500">
                {result.reason}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-400">
              {result.trace_id}
            </span>
          </div>

          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              interpretation
            </div>
            <div className="text-sm text-slate-800 leading-relaxed">
              {result.interpretation}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              suggestion
            </div>
            <div className="text-sm text-slate-800 leading-relaxed">
              {result.suggestion}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              explanations
            </div>
            <ul className="ml-5 text-sm text-slate-600 list-disc leading-relaxed">
              {Array.isArray(result.explanations) && result.explanations.length > 0 ? (
                result.explanations.map((exp, i) => (
                  <li key={i}>{exp}</li>
                ))
              ) : (
                <li>No explanation details returned.</li>
              )}
            </ul>
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-md">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                warnings
              </div>
              <ul className="ml-4 text-sm text-amber-900 list-disc leading-relaxed">
                {result.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Replay Section */}
          {replayResult && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-md">
              <div className="font-mono text-xs font-semibold text-emerald-800 mb-3">
                /gate/replay/{result.trace_id}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
                <BooleanIndicator value={replayResult.same_decision} label="same_decision" />
                <BooleanIndicator value={replayResult.same_reason} label="same_reason" />
                {replayResult.anchor_drift !== undefined && (
                  <div>
                    <div className="text-xs text-slate-500">anchor_drift</div>
                    <div className={`font-mono text-sm font-semibold ${
                      replayResult.anchor_drift === 0 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {replayResult.anchor_drift}
                    </div>
                  </div>
                )}
              </div>
              {replayResult.explanation && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    explanation
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {replayResult.explanation}
                  </div>
                </div>
              )}
            </div>
          )}

          {replayError && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-md">
              <div className="text-sm text-amber-800">
                {replayError}
              </div>
            </div>
          )}

          {!replayResult && !replayError && (
            <button
              onClick={handleReplay}
              disabled={replayLoading}
              className="mt-3 px-3 py-2 text-sm font-medium text-sky-500 bg-transparent border border-sky-500 rounded hover:bg-sky-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {replayLoading ? 'Loading Replay...' : 'Show Replay'}
            </button>
          )}

          {/* Re-run replay after error */}
          {replayError && (
            <button
              onClick={handleReplay}
              disabled={replayLoading}
              className="mt-3 px-3 py-2 text-sm font-medium text-sky-500 bg-transparent border border-sky-500 rounded hover:bg-sky-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {replayLoading ? 'Loading Replay...' : 'Retry Replay'}
            </button>
          )}

          {/* Powered by footer — replaces the old "Request Live Demo" mailto CTA */}
          <div className="mt-5 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              Powered by <span className="font-semibold text-slate-500">SignalWeaver API</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
'''

# ── File 4: .env.example ──
ENV_EXAMPLE = '''# SignalWeaver API backend URL
SIGNALWEAVER_API_BASE_URL=http://localhost:8000

# Bearer token for SignalWeaver API authentication
SIGNALWEAVER_BEARER_TOKEN=

# API key for SignalWeaver API (required when SW_API_KEY is set on the backend)
SIGNALWEAVER_API_KEY=
'''

# ── Write all files ──
files = {
    "src/app/api/evaluate/route.ts": EVALUATE_ROUTE,
    "src/app/api/replay/[traceId]/route.ts": REPLAY_ROUTE,
    "src/components/DemoWidget.tsx": DEMO_WIDGET,
    ".env.example": ENV_EXAMPLE,
}

for path, content in files.items():
    # Create parent directories
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.lstrip("\n"))
    
    files_created.append(path)
    print(f"  OK  {path}")

print(f"\nDone! {len(files_created)} files created / updated.")
print("\nNext steps:")
print("  1. Review the changes:  git diff")
print("  2. Commit:             git add -A && git commit -m 'feat: live demo — real replay + auth fix'")
print("  3. Push:               git push origin main")
print("  4. Vercel will auto-deploy")
