import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioSynthProps {
  isPlaying: boolean;
  reelMode?: boolean;
}

export interface CinematicAudioController {
  startReelTrack: () => void;
  stopReelTrack: () => void;
  triggerSceneTransition: (sceneIndex: number) => void;
  triggerDropImpact: () => void;
  setVolume: (val: number) => void;
}

export const AudioSynth: React.FC<AudioSynthProps> = ({ isPlaying, reelMode = false }) => {
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const reelGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    // Only run on client interaction to satisfy browsers' autoplay policies
    const initAudio = () => {
      if (audioCtxRef.current) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master lowpass filter for warm luxury cinematic space
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);
      filterRef.current = filter;

      // Master ambient gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      gainRef.current = masterGain;

      // Reel soundtrack sub-gain
      const reelGain = ctx.createGain();
      reelGain.gain.setValueAtTime(0.2, ctx.currentTime);
      reelGainRef.current = reelGain;
      reelGain.connect(filter);

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

      try {
        osc1.start(0);
        osc2.start(0);
      } catch {
        // ignore already started
      }

      // LFO modulation for cinematic swell breathing
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15; // 0.15Hz
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 150;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      try {
        lfo.start(0);
      } catch {
        // ignore
      }
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
      gainRef.current.gain.setTargetAtTime(0.18, now, 2.5);
    } else {
      gainRef.current.gain.setTargetAtTime(0, now, 1.2);
    }
  }, [isPlaying, muted]);

  const stopReelTrack = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Luxury Electronic Beats & Transition Effects for Reel Ad
  const triggerSceneTransition = useCallback((sceneIndex: number) => {
    if (!audioCtxRef.current || muted) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Luxurious whoosh / riser
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(300, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(3500, now + 0.6);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.4);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.8);

    // Harmonic chime / bell for luxury reveal
    const bell = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bell.type = 'sine';
    const chordPitches = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const pitch = chordPitches[sceneIndex % chordPitches.length];

    bell.frequency.setValueAtTime(pitch, now + 0.2);
    bell.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.7);

    bellGain.gain.setValueAtTime(0.12, now + 0.2);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    bell.connect(bellGain);
    bellGain.connect(ctx.destination);

    bell.start(now + 0.2);
    bell.stop(now + 0.9);
  }, [muted]);

  const triggerDropImpact = useCallback(() => {
    if (!audioCtxRef.current || muted) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Sub kick/impact
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();

    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(140, now);
    kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.4);

    kickGain.gain.setValueAtTime(0.35, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    kickOsc.connect(kickGain);
    kickGain.connect(ctx.destination);

    kickOsc.start(now);
    kickOsc.stop(now + 0.5);
  }, [muted]);

  // Electronic Luxury Drum/Synth Arpeggio Pattern Loop for Ad
  const startReelTrack = useCallback(() => {
    if (!audioCtxRef.current || muted) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    stopReelTrack();

    const bpm = 122;
    const stepTime = (60 / bpm) / 4; // 16th notes
    let step = 0;

    intervalRef.current = setInterval(() => {
      if (!audioCtxRef.current || muted) return;
      const c = audioCtxRef.current;
      const t = c.currentTime;

      // Kick on 1, 5, 9, 13 (four on the floor luxury house beat)
      if (step % 4 === 0) {
        const kOsc = c.createOscillator();
        const kGain = c.createGain();
        kOsc.frequency.setValueAtTime(120, t);
        kOsc.frequency.exponentialRampToValueAtTime(38, t + 0.18);
        kGain.gain.setValueAtTime(0.2, t);
        kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        kOsc.connect(kGain);
        kGain.connect(c.destination);
        kOsc.start(t);
        kOsc.stop(t + 0.2);
      }

      // Shimmer Hi-hat on offbeats
      if (step % 2 === 1) {
        const hBuffer = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate);
        const data = hBuffer.getChannelData(0);
        for (let i = 0; i < hBuffer.length; i++) data[i] = (Math.random() * 2 - 1) * 0.1;
        const hSource = c.createBufferSource();
        hSource.buffer = hBuffer;
        const hFilter = c.createBiquadFilter();
        hFilter.type = 'highpass';
        hFilter.frequency.value = 8000;
        const hGain = c.createGain();
        hGain.gain.setValueAtTime(0.06, t);
        hGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        hSource.connect(hFilter);
        hFilter.connect(hGain);
        hGain.connect(c.destination);
        hSource.start(t);
        hSource.stop(t + 0.05);
      }

      // Subtle tech synth arpeggio: [A3, C4, E4, G4, B4]
      const notes = [220, 261.63, 329.63, 392.00, 493.88, 523.25];
      if (step % 2 === 0) {
        const sOsc = c.createOscillator();
        const sGain = c.createGain();
        sOsc.type = 'triangle';
        const note = notes[(step / 2) % notes.length];
        sOsc.frequency.setValueAtTime(note, t);
        sGain.gain.setValueAtTime(0.04, t);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        sOsc.connect(sGain);
        sGain.connect(c.destination);
        sOsc.start(t);
        sOsc.stop(t + 0.12);
      }

      step = (step + 1) % 64;
    }, stepTime * 1000);
  }, [muted, stopReelTrack]);

  useEffect(() => {
    return () => {
      stopReelTrack();
    };
  }, [stopReelTrack]);

  // Expose global methods for scene synchronization
  useEffect(() => {
    (window as any).cinematicAudio = {
      triggerSceneTransition,
      triggerDropImpact,
      startReelTrack,
      stopReelTrack,
      isMuted: muted,
      toggleMute: () => setMuted((prev) => !prev),
    };
    (window as any).triggerPulseSFX = triggerDropImpact;

    return () => {
      delete (window as any).cinematicAudio;
      delete (window as any).triggerPulseSFX;
    };
  }, [muted, triggerSceneTransition, triggerDropImpact, startReelTrack, stopReelTrack]);

  if (reelMode) {
    return null; // Silent render when embedded inside Reel UI, controlled via Reel UI toggles
  }

  return (
    <button
      onClick={() => setMuted(!muted)}
      className="fixed bottom-6 left-6 z-[100] p-3 rounded-full bg-dark/80 backdrop-blur-md border border-white/10 hover:border-accent-cyan/50 text-white/70 hover:text-accent-cyan transition duration-300 shadow-lg flex items-center gap-2 text-xs font-semibold"
      title="Toggle Ambient Audio"
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
