import React, { useEffect, useState } from 'react';
import { KKRobotCanvas } from './KKRobotCanvas';
import confetti from 'canvas-confetti';

interface CinematicOpeningProps {
  onComplete: () => void;
  speak: (text: string, callback?: () => void) => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onComplete, speak }) => {
  const [phase, setPhase] = useState<'black' | 'peek' | 'walk-in' | 'center' | 'speaking' | 'clap' | 'faded'>('black');
  const [kkAction, setKkAction] = useState<'idle' | 'walk' | 'wave' | 'clap'>('idle');
  const [kkExpression, setKkExpression] = useState<'happy' | 'thinking' | 'excited'>('happy');

  useEffect(() => {
    let active = true;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const runTimeline = async () => {
      // Phase 1: Black screen
      await delay(2000);
      if (!active) return;
      setPhase('peek');
      setKkAction('idle');
      setKkExpression('thinking');

      // Phase 2: Peek
      await delay(2500);
      if (!active) return;
      setPhase('walk-in');
      setKkAction('walk');

      // Phase 3: Walk-in
      await delay(3000);
      if (!active) return;
      setPhase('center');
      setKkAction('wave');
      setKkExpression('happy');

      // Phase 4: Center stops
      await delay(1500);
      if (!active) return;
      setPhase('speaking');
      setKkAction('idle');

      // Phase 5: Voice intro speaking
      speak(
        "Hello. Welcome to PlanVista. I'm KK. Your Artificial Intelligence Architecture Assistant. Today, I'll show you how PlanVista is changing the future of architecture, engineering, and construction.",
        async () => {
          if (!active) return;
          // Phase 6: Claps
          setPhase('clap');
          setKkAction('clap');
          setKkExpression('excited');

          await delay(1500);
          if (!active) return;

          // Trigger particle and holographic pulse
          if ((window as any).triggerPulseSFX) {
            (window as any).triggerPulseSFX();
          }

          // Beautiful blue and cyan neon confetti fireworks explosion
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#1e40af', '#ffffff', '#8b5cf6'],
          });

          // Phase 7: Faded state transition
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
  }, []); // Run exactly once on mount, immune to callback changes

  if (phase === 'faded') return null;

  return (
    <div className="fixed inset-0 bg-[#020204] z-[9999] flex flex-col items-center justify-center transition-all duration-1000">
      {/* Cinematic grid lines and subtle ambient glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,20,32,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,20,32,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center">
        {phase === 'peek' && (
          <div className="absolute left-4 w-48 h-[300px] overflow-hidden border-r-2 border-dashed border-accent-cyan/30 flex items-center justify-end animate-pulse">
            <span className="text-accent-cyan text-xs font-mono tracking-wider rotate-95 origin-bottom-right mb-6 mr-1">KK INITIALIZING...</span>
          </div>
        )}

        <div
          className={`w-80 h-80 transition-all duration-[3000ms] ease-out-quint ${
            phase === 'black'
              ? 'opacity-0 scale-75 -translate-x-full'
              : phase === 'peek'
              ? 'opacity-80 scale-90 -translate-x-[40%]'
              : phase === 'walk-in'
              ? 'opacity-100 scale-100 translate-x-0'
              : 'opacity-100 scale-110'
          }`}
        >
          <KKRobotCanvas action={kkAction} expression={kkExpression} speaking={phase === 'speaking'} />
        </div>
      </div>

      <div className="absolute bottom-20 px-8 max-w-xl text-center">
        {phase === 'speaking' && (
          <div className="glass-card px-6 py-4 rounded-2xl border-accent-cyan/30 glow-border-cyan animate-pulse">
            <p className="text-accent-cyan font-mono text-sm tracking-widest uppercase mb-1">KK Architecture OS</p>
            <p className="text-white text-base font-light italic leading-relaxed">
              "Hello. Welcome to PlanVista. I'm KK. Your Artificial Intelligence Architecture Assistant. Today I'll show you..."
            </p>
          </div>
        )}

        {phase === 'clap' && (
          <div className="text-accent-cyan font-mono text-sm tracking-widest uppercase animate-ping">
            ✦ CLAP TRIGGERING NEON HOLO PULSE ✦
          </div>
        )}

        {phase === 'peek' && (
          <p className="text-white/40 text-xs font-mono tracking-widest animate-pulse">
            KK IS LOOKING FOR INVESTORS...
          </p>
        )}
      </div>
    </div>
  );
};
