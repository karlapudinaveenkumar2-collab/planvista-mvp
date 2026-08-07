import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AIAssistantSidebarProps {
  onSuggestLayout: () => void;
  onOptimizeLighting: () => void;
  onReduceCost: () => void;
  onImproveSustainability: () => void;
  speak: (text: string) => void;
}

export const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({
  onSuggestLayout,
  onOptimizeLighting,
  onReduceCost,
  onImproveSustainability,
  speak,
}) => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'mistakes'>('copilot');

  const suggestions = [
    { title: 'Room Alignment', desc: 'Repositioning furniture away from the north exit yields a 12% flow rate improvement.' },
    { title: 'Natural Lighting', desc: 'Expand master glaze size on south facade by 0.5m to decrease electricity consumption by 8%.' },
    { title: 'Plumbing Route', desc: 'Colocating secondary washroom back-to-back with master suite cuts conduit costs by $3,400.' },
  ];

  const designMistakes = [
    { severity: 'medium', title: 'HVAC Vent Blocked', desc: 'Drafted sofa at coordinates (34, 120) partially obscures direct warm airflow pathways.' },
    { severity: 'high', title: 'Wall Clearance Issue', desc: 'South hallway width is 0.85m, which violates international ADA wheelchair access standards (minimum 0.91m).' },
  ];

  return (
    <div className="glass-card rounded-2xl border-white/10 overflow-hidden flex flex-col h-[520px] shadow-2xl" id="ai">
      {/* Tab select header */}
      <div className="grid grid-cols-2 border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => { setActiveTab('copilot'); speak("Opening active generative copilot options."); }}
          className={`py-3 text-center transition ${
            activeTab === 'copilot' ? 'bg-white/5 border-b-2 border-accent-cyan text-accent-cyan' : 'text-white/40 hover:text-white'
          }`}
        >
          AI Co-Pilot
        </button>
        <button
          onClick={() => { setActiveTab('mistakes'); speak("Running live structure mistake detection sweeps."); }}
          className={`py-3 text-center transition ${
            activeTab === 'mistakes' ? 'bg-white/5 border-b-2 border-accent-cyan text-accent-cyan' : 'text-white/40 hover:text-white'
          }`}
        >
          Mistake Audit ({designMistakes.length})
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
        {activeTab === 'copilot' ? (
          <>
            <div className="bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl p-4 flex gap-3">
              <span className="text-accent-cyan shrink-0 mt-0.5 animate-pulse">🤖</span>
              <div>
                <h5 className="text-white font-bold text-xs">How can I assist your design?</h5>
                <p className="text-white/60 text-[10px] mt-1 leading-relaxed">
                  Trigger smart neural-net iterations instantly to refine construction metrics.
                </p>
              </div>
            </div>

            {/* Quick action generative triggers */}
            <div className="space-y-2.5">
              <button
                onClick={onSuggestLayout}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan"><Sparkles className="w-4 h-4" /></span>
                  <span className="text-white text-xs font-semibold">Suggest Premium Room Layouts</span>
                </div>
              </button>

              <button
                onClick={onOptimizeLighting}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400">☀️</span>
                  <span className="text-white text-xs font-semibold">Optimize Natural Sunlight</span>
                </div>
              </button>

              <button
                onClick={onReduceCost}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-green-500/10 text-green-400">💰</span>
                  <span className="text-white text-xs font-semibold">Reduce Construction Cost</span>
                </div>
              </button>

              <button
                onClick={onImproveSustainability}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-accent-purple/10 text-accent-purple">☘️</span>
                  <span className="text-white text-xs font-semibold">Improve Sustainability Score</span>
                </div>
              </button>
            </div>

            {/* Suggestions list */}
            <div>
              <h5 className="text-white font-bold text-[11px] uppercase tracking-wider font-mono mb-3 text-white/40">Active AI Feedback Log</h5>
              <div className="space-y-2.5">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                    <p className="text-accent-cyan text-xs font-semibold">{s.title}</p>
                    <p className="text-white/60 text-[10px] mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex gap-3">
              <span className="text-red-400 shrink-0 mt-0.5 animate-pulse">🤖</span>
              <div>
                <h5 className="text-white font-bold text-xs">Global Code Verification</h5>
                <p className="text-white/60 text-[10px] mt-1 leading-relaxed">
                  Real-time design checks with ADA standardizations, fire safety routes, and structural gravity limitations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {designMistakes.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 border rounded-xl flex gap-3 ${
                    m.severity === 'high' ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-orange-500/10 border-orange-500/30 text-orange-200'
                  }`}
                >
                  <span className="shrink-0 text-lg">⚠️</span>
                  <div>
                    <h6 className="font-bold text-xs text-white">{m.title}</h6>
                    <p className="text-[10px] text-white/60 mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AIAssistantSidebar;
