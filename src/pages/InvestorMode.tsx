import React, { useState } from 'react';
import { Award } from 'lucide-react';

interface InvestorModeProps {
  speak: (text: string) => void;
}

interface PitchSlide {
  title: string;
  subtitle: string;
  bullets: string[];
  metricLabel: string;
  metricValue: string;
}

const PITCH_SLIDES: PitchSlide[] = [
  {
    title: 'The Blueprint Bottleneck',
    subtitle: 'The Architectural Problem Space',
    bullets: [
      'CAD vector drawing remains extremely isolated from volumetric 3D structural simulation.',
      'Manual estimation of raw materials and compliance safety checks takes weeks.',
      'Collaboration between regional designers and construction managers is highly disconnected.',
    ],
    metricLabel: 'TIME LOST IN CRITICAL BLUEPRINT CORRECTIONS',
    metricValue: '72%',
  },
  {
    title: 'Autonomous Real-time Design',
    subtitle: 'The PlanVista Solution',
    bullets: [
      'Fully unified 2D design workspace with millisecond-grade solid 3D extrusion.',
      'Smart cognitive AI assistant (KK) auditing safety compliance and daylight exposure.',
      'Instant Bill of Quantities (BOQ) with dynamic multi-format spreadsheet logs.',
    ],
    metricLabel: 'DESIGN PRODUCTION ACCELERATION RATE',
    metricValue: '5.4x',
  },
  {
    title: 'Global Construction Index',
    subtitle: 'Market Size & Potential TAM',
    bullets: [
      'The AEC software market expansion rate continues to yield massive scaling.',
      'High-growth regions in urban residential housing demand intelligent platforms.',
      'Enterprise subscription licensing unlocks multi-billion dollar addressable pipelines.',
    ],
    metricLabel: 'PROJECTED AEC TOTAL ADDRESSABLE MARKET BY 2030',
    metricValue: '$18.4B',
  },
  {
    title: 'PlanVista Monopolies',
    subtitle: 'Competitive Advantage & Core IP',
    bullets: [
      'KK Cognitive Intelligence Engine processes construction safety indices seamlessly.',
      'WebGL rendering offers desktop-grade viewport frames directly inside responsive web browsers.',
      'Multi-user WebSocket drawing vectors prevent design file branching entirely.',
    ],
    metricLabel: 'PATENTED STRUCTURAL COGNITIVE PATTERNS',
    metricValue: '14 Patents',
  },
];

export const InvestorMode: React.FC<InvestorModeProps> = ({ speak }) => {
  const [slideIdx, setSlideIdx] = useState(0);

  const slide = PITCH_SLIDES[slideIdx];

  const handleNextSlide = () => {
    if (slideIdx < PITCH_SLIDES.length - 1) {
      const nextIdx = slideIdx + 1;
      setSlideIdx(nextIdx);
      speak(`Moving to pitch slide ${nextIdx + 1}: ${PITCH_SLIDES[nextIdx].title}. ${PITCH_SLIDES[nextIdx].bullets.join(' ')}`);
    }
  };

  const handlePrevSlide = () => {
    if (slideIdx > 0) {
      const prevIdx = slideIdx - 1;
      setSlideIdx(prevIdx);
      speak(`Returning to pitch slide ${prevIdx + 1}: ${PITCH_SLIDES[prevIdx].title}.`);
    }
  };

  const handleStartPitch = () => {
    speak(
      "Distinguished investors and corporate partners. Welcome to PlanVista Premium Keynote presentation. Today, we present our disruptive market thesis, high-growth revenue modules, and technology advantages. Let us begin with the blueprint bottleneck."
    );
  };

  return (
    <div className="w-full pb-20 animate-fade-in" id="investor">
      {/* Intro */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="text-accent-cyan font-mono text-xs uppercase tracking-widest bg-accent-cyan/10 px-3 py-1.5 rounded-full border border-accent-cyan/20">
          Executive Presentation
        </span>
        <h2 className="text-4xl font-extrabold text-white mt-5 mb-4 tracking-tight">Keynote Pitch Deck</h2>
        <p className="text-white/60 text-sm font-light max-w-xl mx-auto leading-relaxed">
          KK presents our business model, market indicators, patent barriers, and product scaling roadmap to global partners.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex justify-center mb-6">
        <button
          onClick={handleStartPitch}
          className="px-6 py-3 rounded-xl bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-extrabold text-xs transition duration-300 flex items-center gap-2 shadow-lg shadow-accent-cyan/15 animate-bounce"
        >
          <Award className="w-4 h-4" />
          <span>Launch Premium Keynote Pitch Presentation</span>
        </button>
      </div>

      {/* Main Pitch Slide Display Frame */}
      <div className="max-w-4xl mx-auto glass-card rounded-3xl border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/[0.01] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <p className="text-accent-cyan font-mono text-[10px] uppercase tracking-widest">{slide.subtitle}</p>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">{slide.title}</h3>
            </div>

            <ul className="space-y-4 text-xs text-white/70 leading-relaxed">
              {slide.bullets.map((bullet, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-accent-cyan font-bold">✦</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metric Highlight Box */}
          <div className="glass-card rounded-2xl p-6 border-accent-cyan/10 flex flex-col justify-center items-center text-center bg-accent-cyan/[0.01]">
            <p className="text-[9px] font-mono uppercase text-white/40 tracking-wider mb-2">{slide.metricLabel}</p>
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
              {slide.metricValue}
            </span>
          </div>
        </div>

        {/* Slide navigation controls */}
        <div className="flex items-center justify-between mt-12 border-t border-white/5 pt-6">
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <span>Slide</span>
            <span className="font-mono text-white">{slideIdx + 1}</span>
            <span>of</span>
            <span className="font-mono text-white">{PITCH_SLIDES.length}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevSlide}
              disabled={slideIdx === 0}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold disabled:opacity-20 transition"
            >
              Previous Slide
            </button>
            <button
              onClick={handleNextSlide}
              disabled={slideIdx === PITCH_SLIDES.length - 1}
              className="px-4 py-2 rounded-lg bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold text-xs disabled:opacity-20 transition"
            >
              Next Slide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvestorMode;
