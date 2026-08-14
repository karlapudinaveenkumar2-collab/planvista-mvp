import React, { useEffect, useState } from 'react';
import { KKRobotCanvas } from './KKRobotCanvas';
import confetti from 'canvas-confetti';

interface CinematicOpeningProps {
  onComplete: () => void;
  speak: (text: string, callback?: () => void) => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onComplete, speak }) => {
  const [phase, setPhase] = useState<'black' | 'peek' | 'walk-in' | 'center' | 'speaking' | 'clap' | 'faded'>('black');
  const [kkAction, setKkAction] = useState<'idle' | 'walk' | 'wave' | 'clap' | 'tilt' | 'explain'>('idle');
  const [kkExpression, setKkExpression] = useState<'happy' | 'thinking' | 'excited' | 'focused'>('happy');

  useEffect(() => {
    let active = true;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const runTimeline = async () => {
      // Phase 1: Black screen - completely quiet and dark
      await delay(2000);
      if (!active) return;

      // Phase 2: Peek - KK slowly peeks from the left side of the screen using one eye. Looks around.
      setPhase('peek');
      setKkAction('tilt');
      setKkExpression('thinking');

      await delay(3000);
      if (!active) return;

      // Smile naturally before walking
      setKkExpression('happy');
      await delay(800);
      if (!active) return;

      // Phase 3: Walk-in - Walks onto the screen with camera slightly following
      setPhase('walk-in');
      setKkAction('walk');

      await delay(3500);
      if (!active) return;

      // Phase 4: Center - Stops, looks directly at the visitor and waves naturally
      setPhase('center');
      setKkAction('wave');
      setKkExpression('happy');

      await delay(2000);
      if (!active) return;

      // Phase 5: Voice Introduction
      setPhase('speaking');
      setKkAction('explain');

      speak(
        "Hello. Welcome to PlanVista. I'm KK. Your Artificial Intelligence Architecture Assistant. Today I'll show you how PlanVista is changing the future of architecture, engineering and construction.",
        async () => {
          if (!active) return;
          // Phase 6: Magical Transition - KK claps once
          setPhase('clap');
          setKkAction('clap');
          setKkExpression('excited');

          await delay(1200);
          if (!active) return;

          // Trigger holographic pulse SFX
          if ((window as any).triggerPulseSFX) {
            (window as any).triggerPulseSFX();
          }

          // Futuristic holographic pulse, blue/cyan neon confetti explosion
          confetti({
            particleCount: 180,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#00f0ff', '#1e40af', '#ffffff', '#8b5cf6'],
          });

          setPhase('faded');
          await delay(1000);
          if (!active) return;
          onComplete();
        }
      );
    };

    runTimeline();

    return () => {
      active = false;
    };
  }, []);

  if (phase === 'faded') return null;

  // Camera follow effect class based on phase
  const getCameraFollowStyle = () => {
    switch (phase) {
      case 'black':
        return 'translate-x-0 scale-100';
      case 'peek':
        return 'translate-x-[3%] scale-102'; // Camera shifted to the right, highlighting left edge
      case 'walk-in':
        return 'translate-x-[-1.5%] scale-101'; // Camera panning left as KK walks in
      case 'center':
      case 'speaking':
      case 'clap':
        return 'translate-x-0 scale-105'; // Camera zoomed in on the center stage
      default:
        return 'translate-x-0 scale-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020204] z-[9999] overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Background with Camera Follow Effect applied to Grid and Glows */}
      <div className={`absolute inset-0 transition-all duration-[3000ms] ease-out ${getCameraFollowStyle()}`}>
        {/* Cinematic Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,20,32,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,20,32,0.15)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Ambient Neon Lights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[140px] pointer-events-none"></div>
      </div>

      {/* Screen Border Cinematic Overlay */}
      <div className="absolute inset-4 border border-white/[0.03] pointer-events-none rounded-3xl"></div>

      {/* Main viewport for KK */}
      <div className="relative w-full h-[450px] flex items-center justify-center">
        {phase === 'peek' && (
          <div className="absolute left-12 top-1/4 text-accent-cyan/40 font-mono text-xs tracking-widest uppercase animate-pulse flex flex-col gap-1">
            <span>[ SYSTEM_PEEK_MODE ]</span>
            <span className="text-[10px] text-white/30">Target acquired: Visitor</span>
          </div>
        )}

        {/* KK Robot Positioning with Precise Cinematic Transition */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-96 h-96 transition-all ease-out-quint ${
            phase === 'black'
              ? 'left-0 -translate-x-full opacity-0 scale-90 duration-[2000ms]'
              : phase === 'peek'
              ? 'left-0 -translate-x-[36%] opacity-100 scale-100 duration-[2500ms]' // Exactly peeking using one eye from left edge of screen
              : phase === 'walk-in'
              ? 'left-1/2 -translate-x-1/2 opacity-100 scale-100 duration-[3500ms]' // Walks smoothly to center
              : 'left-1/2 -translate-x-1/2 opacity-100 scale-110 duration-[1500ms]' // Centered zoom focus
          }`}
        >
          <KKRobotCanvas action={kkAction} expression={kkExpression} speaking={phase === 'speaking'} />
        </div>
      </div>

      {/* Subtitles & HUD Info */}
      <div className="absolute bottom-24 px-8 max-w-xl text-center z-10">
        {phase === 'peek' && (
          <p className="text-accent-cyan font-mono text-xs tracking-[0.2em] uppercase animate-pulse">
            • KK is looking around •
          </p>
        )}

        {phase === 'center' && (
          <p className="text-white/40 font-mono text-xs tracking-[0.15em] uppercase animate-pulse">
            Establishing connection...
          </p>
        )}

        {phase === 'speaking' && (
          <div className="glass-card px-8 py-5 rounded-2xl border-accent-cyan/30 glow-border-cyan shadow-2xl transition-all duration-500">
            <p className="text-accent-cyan font-mono text-xs tracking-widest uppercase mb-1.5 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping"></span>
              KK AI OPERATING SYSTEM
            </p>
            <p className="text-white text-base font-light italic leading-relaxed">
              "Hello. Welcome to PlanVista. I'm KK. Your Artificial Intelligence Architecture Assistant. Today I'll show you..."
            </p>
          </div>
        )}

        {phase === 'clap' && (
          <div className="text-accent-cyan font-mono text-sm tracking-[0.25em] uppercase animate-ping">
            ✦ INITIALIZING PLATFORM PULSE ✦
          </div>
        )}
      </div>

      {/* Visual Watermark */}
      <div className="absolute bottom-6 font-mono text-[9px] text-white/10 tracking-[0.5em] uppercase pointer-events-none">
        PLANVISTA PREMIUM ARCHITECTURE OS v2.4
      </div>
    </div>
  );
};
