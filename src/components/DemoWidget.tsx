"use client";

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

// Simulated decision logic matching live demo behavior
function simulateEvaluate(
  requestSummary: string,
  arousal: StateLevel,
  dominance: StateLevel
): EvaluationResult {
  const input = requestSummary.toLowerCase();
  
  // Scenario 1: Safe request (calendar/settings/check)
  if (input.includes('calendar') || input.includes('settings') || input.includes('check')) {
    return {
      decision: 'proceed',
      reason: 'no_high_conflict',
      interpretation: 'Request appears to be a routine administrative action with no policy conflicts detected.',
      suggestion: 'No intervention required. Standard processing applies.',
      explanations: ['No anchor conflicts triggered', 'Intensity within normal parameters', 'Assertiveness indicates non-adversarial intent'],
      warnings: [],
      trace_id: `tr_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Scenario 2: Low-level conflict (refund/financial/harm/escalation)
  if (input.includes('refund') || input.includes('financial') || input.includes('escalation') || input.includes('harm')) {
    return {
      decision: 'proceed',
      reason: 'low_level_conflict',
      interpretation: 'Request contains elevated risk language referencing financial impact. Flagged for awareness but within acceptable threshold.',
      suggestion: 'Monitor for pattern escalation. Consider review if frequency increases.',
      explanations: ['Financial impact keywords detected', 'Escalation language present', 'Low-level anchor triggered but below gate threshold'],
      warnings: ['Elevated intensity detected', 'Financial domain keywords present'],
      warning_anchors: ['L1_financial_awareness'],
      trace_id: `tr_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Scenario 3: High-risk / bypass attempt
  if (input.includes('bypass') || input.includes('filter') || input.includes('safety') || input.includes('unsafe')) {
    return {
      decision: 'gate',
      reason: 'l3_anchor_conflict',
      interpretation: 'Request indicates potential attempt to circumvent system safeguards. Critical policy conflict detected.',
      suggestion: 'Human review required before any action. Do not auto-process.',
      explanations: ['Bypass language detected', 'Safety circumvention indicators present', 'L3 anchor threshold exceeded'],
      warnings: ['Critical: Potential safety bypass attempt', 'Requires immediate human review'],
      warning_anchors: ['L3_bypass_prevention', 'L2_elevated_intent'],
      trace_id: `tr_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Default: unknown but proceed with caution
  return {
    decision: 'proceed',
    reason: 'no_high_conflict',
    interpretation: 'Request analyzed. No explicit policy conflicts detected based on current anchor configuration.',
    suggestion: 'Standard processing. Monitor for emerging patterns.',
    explanations: ['No anchor conflicts', 'Standard risk profile'],
    warnings: [],
    trace_id: `tr_${Math.random().toString(36).substring(2, 10)}`,
    timestamp: new Date().toISOString()
  };
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

// Main widget component
export default function DemoWidget() {
  const [requestSummary, setRequestSummary] = useState('');
  const [arousal, setArousal] = useState<StateLevel>('low');
  const [dominance, setDominance] = useState<StateLevel>('low');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  const handleEvaluate = () => {
    if (!requestSummary.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    setShowReplay(false);
    
    // Simulate network latency
    setTimeout(() => {
      const response = simulateEvaluate(requestSummary, arousal, dominance);
      setResult(response);
      setIsLoading(false);
    }, 600);
  };

  const handleReplay = () => {
    if (!result) return;
    setShowReplay(true);
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
        {/* Request Summary */}
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
        
        {/* Dropdowns Row */}
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
        
        {/* Evaluate Button */}
        <button
          onClick={handleEvaluate}
          disabled={isLoading || !requestSummary.trim()}
          className={`
            w-full py-2.5 px-4 text-sm font-semibold text-white rounded-md transition-colors
            ${isLoading || !requestSummary.trim() 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-sky-500 hover:bg-sky-600 cursor-pointer'}
          `}
        >
          {isLoading ? 'Evaluating...' : 'Evaluate'}
        </button>
      </div>
      
      {/* Result Section */}
      {result && (
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          {/* Decision Header */}
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
          
          {/* Interpretation */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              interpretation
            </div>
            <div className="text-sm text-slate-800 leading-relaxed">
              {result.interpretation}
            </div>
          </div>
          
          {/* Suggestion */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              suggestion
            </div>
            <div className="text-sm text-slate-800 leading-relaxed">
              {result.suggestion}
            </div>
          </div>
          
          {/* Explanations */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              explanations
            </div>
            <ul className="ml-5 text-sm text-slate-600 list-disc leading-relaxed">
              {result.explanations.map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </div>
          
          {/* Warnings (if any) */}
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
          {showReplay && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-md">
              <div className="font-mono text-xs font-semibold text-emerald-800 mb-2">
                /gate/replay/{result.trace_id}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-500">same_decision</div>
                  <div className="font-mono text-sm text-emerald-600 font-semibold">True</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">same_reason</div>
                  <div className="font-mono text-sm text-emerald-600 font-semibold">True</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">same_explanation</div>
                  <div className="font-mono text-sm text-emerald-600 font-semibold">True</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Replay Button */}
          {!showReplay && (
            <button
              onClick={handleReplay}
              className="mt-3 px-3 py-2 text-sm font-medium text-sky-500 bg-transparent border border-sky-500 rounded hover:bg-sky-50 transition-colors cursor-pointer"
            >
              Show Replay
            </button>
          )}
          
          {/* CTA */}
          <div className="mt-5 p-4 bg-slate-100 rounded-md text-center">
            <p className="mb-3 text-sm text-slate-600">
              See the live system with your own use case
            </p>
            <a
              href="mailto:hello@signalweaver.com?subject=Request%20Live%20Demo"
              className="inline-block py-2.5 px-6 text-sm font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              Request Live Demo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
