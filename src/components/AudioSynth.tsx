import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioSynthProps {
  isPlaying: boolean;
}

export const AudioSynth: React.FC<AudioSynthProps> = ({ isPlaying }) => {
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Only run on client interaction to satisfy browsers' autoplay policies
    const initAudio = () => {
      if (audioCtxRef.current) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Low pass filter for warm premium cinematic space/ambient sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filterRef.current = filter;

      // Gain master
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      gainRef.current = masterGain;

      // Link up nodes
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Create dual sub oscillators for cinematic droning/atmospheric pad
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
      osc1Ref.current = osc1;

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3 perfect fifth
      osc2Ref.current = osc2;

      // Individual gain nodes
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.08, ctx.currentTime);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.06, ctx.currentTime);

      osc1.connect(g1);
      g1.connect(filter);

      osc2.connect(g2);
      g2.connect(filter);

      osc1.start(0);
      osc2.start(0);

      // LFO modulation for cinematic swell breathing
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15; // 0.15Hz
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 150;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(0);
    };

    const handleUserGesture = () => {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener('click', handleUserGesture);
    window.addEventListener('keydown', handleUserGesture);

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, []);

  useEffect(() => {
    if (!audioCtxRef.current || !gainRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    if (isPlaying && !muted) {
      // Cinematic swell in
      gainRef.current.gain.setTargetAtTime(0.18, now, 2.5);
    } else {
      // Swell down
      gainRef.current.gain.setTargetAtTime(0, now, 1.2);
    }
  }, [isPlaying, muted]);

  // Public helper to play futuristic holographic UI beep/pulse SFX
  const triggerPulseSFX = () => {
    if (!audioCtxRef.current || muted) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const beepOsc = ctx.createOscillator();
    const beepGain = ctx.createGain();

    beepOsc.type = 'sine';
    // Cyber sweep frequency
    beepOsc.frequency.setValueAtTime(880, now);
    beepOsc.frequency.exponentialRampToValueAtTime(110, now + 0.6);

    beepGain.gain.setValueAtTime(0.2, now);
    beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    beepOsc.connect(beepGain);
    beepGain.connect(ctx.destination);

    beepOsc.start();
    beepOsc.stop(now + 0.6);
  };

  // Expose play function to global window so the transition can call it directly
  useEffect(() => {
    (window as any).triggerPulseSFX = triggerPulseSFX;
    return () => {
      delete (window as any).triggerPulseSFX;
    };
  }, [muted]);

  return (
    <button
      onClick={() => setMuted(!muted)}
      className="fixed bottom-6 left-6 z-[100] p-3 rounded-full bg-dark/80 backdrop-blur-md border border-white/10 hover:border-accent-cyan/50 text-white/70 hover:text-accent-cyan transition duration-300 shadow-lg flex items-center gap-2 text-xs font-semibold"
    >
      {muted ? (
        <>
          <VolumeX className="w-4 h-4" />
          <span>Cinematic Audio Muted</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 animate-pulse text-accent-cyan" />
          <span>Ambient Cinematic Pad Active</span>
        </>
      )}
    </button>
  );
};
