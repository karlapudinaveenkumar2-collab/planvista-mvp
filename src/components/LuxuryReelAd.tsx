import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Sliders,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Compass,
  ShoppingBag,
  Briefcase,
  Layers,
  Zap,
} from 'lucide-react';

interface LuxuryReelAdProps {
  speakFemaleVoice?: (text: string, onEnd?: () => void) => void;
  stopSpeaking?: () => void;
}

interface SceneData {
  id: number;
  name: string;
  duration: number; // in seconds
  start: number;
  end: number;
  hookText: string;
  subText?: string;
  voiceover: string;
  description: string;
}

const SCENES: SceneData[] = [
  {
    id: 1,
    name: 'The Hook',
    duration: 5,
    start: 0,
    end: 5,
    hookText: 'YOUR BUSINESS DESERVES MORE.',
    voiceover: 'Your business has potential. But is your online presence showing it?',
    description: 'Dark, luxurious office environment. An outdated website glowing on a laptop with dramatic blue highlights.',
  },
  {
    id: 2,
    name: 'The Transformation',
    duration: 6,
    start: 5,
    end: 11,
    hookText: 'TURN YOUR IDEAS INTO DIGITAL EXPERIENCES.',
    voiceover: 'We transform your ideas into beautiful, modern websites designed to make an impression.',
    description: 'Smooth morph into stunning modern responsive websites across laptop, tablet, and smartphone.',
  },
  {
    id: 3,
    name: 'The Experience',
    duration: 7,
    start: 11,
    end: 18,
    hookText: 'MODERN DESIGN. SMART FUNCTIONALITY. PROFESSIONAL RESULTS.',
    voiceover: 'From business websites to online stores, we help bring your brand to life online.',
    description: 'Showcasing business websites, online stores, portfolios, and high-converting landing pages.',
  },
  {
    id: 4,
    name: 'The Brand Reveal',
    duration: 4,
    start: 18,
    end: 22,
    hookText: 'YOUR DIGITAL PRESENCE STARTS HERE.',
    voiceover: "Let's build something extraordinary together.",
    description: 'Dark navy aura, glowing light flare sweeps, and sophisticated brand identity reveal.',
  },
  {
    id: 5,
    name: 'Call to Action',
    duration: 3,
    start: 22,
    end: 25,
    hookText: 'NEED A WEBSITE?\nLET’S BUILD YOURS.\nDM US TODAY.',
    voiceover: 'Message us today and take your business online.',
    description: 'Ultra-modern website mockup with Instagram contact details and direct booking CTA.',
  },
];

export const LuxuryReelAd: React.FC<LuxuryReelAdProps> = ({
  speakFemaleVoice,
  stopSpeaking,
}) => {
  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [voiceoverMuted, setVoiceoverMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Reel Customization & Branding state
  const [businessName, setBusinessName] = useState<string>('LUMINA DIGITAL');
  const [instagramHandle, setInstagramHandle] = useState<string>('@lumina.digital');
  const [industryFocus, setIndustryFocus] = useState<string>('Luxury Design & Architecture');
  const [customizerOpen, setCustomizerOpen] = useState<boolean>(false);
  const [, setInteractiveCategory] = useState<'business' | 'store' | 'portfolio' | 'landing'>('business');

  // Animation ticks & Scene 3 device carousel
  const [scene3ActiveIndex, setScene3ActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpokenSceneRef = useRef<number | null>(null);

  const totalDuration = 25; // Exact 25 seconds duration

  // Voiceover playback sync
  const triggerSceneVoiceover = useCallback(
    (sceneIdx: number) => {
      if (voiceoverMuted) return;
      const scene = SCENES[sceneIdx];
      if (!scene) return;

      if (speakFemaleVoice) {
        speakFemaleVoice(scene.voiceover);
      }
    },
    [speakFemaleVoice, voiceoverMuted]
  );

  // Sync background music / sound effects
  useEffect(() => {
    if (isPlaying && !audioMuted) {
      if ((window as any).cinematicAudio) {
        (window as any).cinematicAudio.startReelTrack?.();
      }
    } else {
      if ((window as any).cinematicAudio) {
        (window as any).cinematicAudio.stopReelTrack?.();
      }
    }
    return () => {
      if ((window as any).cinematicAudio) {
        (window as any).cinematicAudio.stopReelTrack?.();
      }
    };
  }, [isPlaying, audioMuted]);

  // Main high-precision animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= totalDuration) {
            // Loop or restart gracefully
            return 0;
          }
          return next;
        });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Determine current active scene based on currentTime
  useEffect(() => {
    const foundIndex = SCENES.findIndex(
      (s) => currentTime >= s.start && currentTime < s.end
    );
    const validIndex = foundIndex !== -1 ? foundIndex : SCENES.length - 1;

    if (validIndex !== activeSceneIndex) {
      setActiveSceneIndex(validIndex);
      // Trigger sound effect
      if ((window as any).cinematicAudio && !audioMuted) {
        (window as any).cinematicAudio.triggerSceneTransition?.(validIndex);
      }
    }

    // Trigger voiceover once per scene entry
    if (lastSpokenSceneRef.current !== validIndex) {
      lastSpokenSceneRef.current = validIndex;
      triggerSceneVoiceover(validIndex);
    }
  }, [currentTime, activeSceneIndex, audioMuted, triggerSceneVoiceover]);

  // Internal rotating cycle for Scene 3 (Showcasing 4 designs in 7 seconds)
  useEffect(() => {
    if (activeSceneIndex === 2) {
      const scene3Progress = (currentTime - 11) / 7;
      const subIndex = Math.min(3, Math.floor(scene3Progress * 4));
      setScene3ActiveIndex(subIndex);
    }
  }, [currentTime, activeSceneIndex]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    const sceneIndex = SCENES.findIndex((s) => time >= s.start && time < s.end);
    if (sceneIndex !== -1) {
      lastSpokenSceneRef.current = sceneIndex;
      triggerSceneVoiceover(sceneIndex);
    }
  };

  const handleRestart = () => {
    if (stopSpeaking) stopSpeaking();
    setCurrentTime(0);
    lastSpokenSceneRef.current = 0;
    setIsPlaying(true);
    triggerSceneVoiceover(0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-center justify-center p-4 md:p-6 min-h-[92vh] max-w-7xl mx-auto">
      {/* LEFT / CENTER: THE LUXURY INSTAGRAM REEL (9:16 VERTICAL CANVAS) */}
      <div className="flex flex-col items-center">
        {/* Aspect Ratio 9:16 vertical container */}
        <div
          ref={containerRef}
          className={`relative w-[340px] sm:w-[380px] md:w-[420px] aspect-[9/16] rounded-[44px] overflow-hidden border-[8px] border-[#181d2f] shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(0,240,255,0.15)] bg-[#030611] select-none ${
            isFullscreen ? 'fixed inset-0 m-auto z-[9999] rounded-none border-0 max-h-screen' : ''
          }`}
          data-testid="reel-frame"
        >
          {/* Subtle Dynamic Ambient Lighting & Electric Blue Edge Glow */}
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_80px_rgba(0,240,255,0.06)]"></div>
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-20"></div>
          <div className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-20"></div>

          {/* Smartphone Notch / Dynamic Island */}
          <div className="absolute top-3 inset-x-0 flex justify-center z-40 pointer-events-none">
            <div className="w-28 h-5 bg-[#0b0e1b] rounded-full border border-white/10 flex items-center justify-between px-3">
              <div className="w-2 h-2 rounded-full bg-[#1b233d]"></div>
              <div className="w-3 h-3 rounded-full bg-accent-cyan/40 animate-pulse"></div>
            </div>
          </div>

          {/* Reel Top Bar: Segmented Progress Bar (5 scenes) */}
          <div className="absolute top-11 inset-x-4 z-40 flex gap-1.5 pointer-events-none">
            {SCENES.map((scene) => {
              let fillPercent = 0;
              if (currentTime >= scene.end) {
                fillPercent = 100;
              } else if (currentTime >= scene.start) {
                fillPercent = ((currentTime - scene.start) / scene.duration) * 100;
              }

              return (
                <div
                  key={scene.id}
                  className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
                >
                  <div
                    className="h-full bg-white transition-all duration-75 rounded-full"
                    style={{
                      width: `${fillPercent}%`,
                      boxShadow: fillPercent > 0 ? '0 0 8px rgba(255,255,255,0.8)' : 'none',
                    }}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* Reel Top Action Header */}
          <div className="absolute top-14 inset-x-5 z-40 flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-white via-white to-accent-cyan bg-clip-text text-transparent">
                REEL
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                SCENE {activeSceneIndex + 1}/5
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVoiceoverMuted(!voiceoverMuted)}
                className={`p-1.5 rounded-full backdrop-blur-md border text-[10px] flex items-center gap-1 transition ${
                  voiceoverMuted
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : 'bg-black/40 border-white/20 text-white hover:border-accent-cyan/50'
                }`}
                title="Toggle Voiceover"
              >
                {voiceoverMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-accent-cyan" />}
                <span className="hidden sm:inline">VO</span>
              </button>

              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className={`p-1.5 rounded-full backdrop-blur-md border text-[10px] flex items-center gap-1 transition ${
                  audioMuted
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : 'bg-black/40 border-white/20 text-white hover:border-accent-cyan/50'
                }`}
                title="Toggle Music Synth"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              </button>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* SCENE CANVAS CONTAINER (0 to 25 SECONDS) */}
          {/* ==================================================================== */}
          <div className="relative w-full h-full overflow-hidden">
            {/* ------------------------------------------------------------------ */}
            {/* SCENE 1: THE HOOK (0 - 5 SECONDS) */}
            {/* Dark luxury office, outdated website on glowing laptop, blue highlights */}
            {/* ------------------------------------------------------------------ */}
            {currentTime < 5.2 && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between p-6 transition-all duration-700 ${
                  activeSceneIndex === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                data-testid="scene-1"
              >
                {/* Office luxury dark background & ambient rim lighting */}
                <div className="absolute inset-0 bg-[#060814] -z-10">
                  <div className="absolute top-1/4 -right-16 w-64 h-64 bg-accent-blue/20 rounded-full blur-[80px]"></div>
                  <div className="absolute bottom-10 -left-10 w-72 h-72 bg-accent-cyan/15 rounded-full blur-[90px]"></div>
                  {/* Subtle office silhouettes / window blinds / high-rise reflection */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>

                {/* Top Hook Statement */}
                <div className="mt-20 w-full text-center z-20 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 uppercase animate-pulse">
                    Scene 01 • The Reality Check
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight uppercase"
                    data-testid="scene-1-title"
                  >
                    YOUR BUSINESS <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-cyan to-blue-400">
                      DESERVES MORE.
                    </span>
                  </h2>
                </div>

                {/* Dramatic Visual: Laptop displaying an outdated, clunky 2000s website */}
                <div className="relative w-full max-w-[290px] mx-auto my-auto z-20">
                  {/* Business owner executive silhouette glowing in laptop reflection */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-b from-blue-900/40 to-transparent blur-md pointer-events-none"></div>

                  {/* Outdated Laptop Screen Mockup */}
                  <div className="bg-[#121420] rounded-xl border-2 border-red-500/30 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(239,68,68,0.2)]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10 px-1 text-[8px] text-white/50 font-mono">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
                        <span className="w-2 h-2 rounded-full bg-green-500/80"></span>
                      </div>
                      <span className="text-red-400/90 font-mono">outdated-site-v1-2008.htm</span>
                      <span className="text-red-400 font-bold uppercase">404 VIBE</span>
                    </div>

                    {/* Clunky Outdated Layout */}
                    <div className="bg-[#e2e8f0] text-slate-800 p-2 rounded mt-1 text-[9px] font-serif space-y-2 border border-slate-400">
                      <div className="bg-blue-800 text-white p-1 text-center font-bold text-[10px] tracking-wide">
                        ★ WELCOME TO OUR WEB HOMEPAGE ★
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[7px] text-center">
                        <div className="bg-slate-300 p-1 border">Under Construction</div>
                        <div className="bg-slate-300 p-1 border">Low Res Photos</div>
                        <div className="bg-slate-300 p-1 border">Broken Links</div>
                      </div>
                      <div className="h-10 bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 text-[8px] italic">
                        [ Non-Responsive Desktop Frame 800x600 ]
                      </div>
                      <div className="text-center text-[7px] text-red-600 font-sans font-bold animate-pulse">
                        ⚠️ 78% of potential clients leave instantly
                      </div>
                    </div>
                  </div>

                  {/* Laptop base */}
                  <div className="w-full h-3 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 rounded-b-xl shadow-lg flex justify-center">
                    <div className="w-12 h-1 bg-gray-900 rounded-b-sm"></div>
                  </div>
                </div>

                {/* Subtitle / Voiceover caption */}
                <div className="mb-20 z-20 w-full text-center px-2">
                  <div className="glass-card px-4 py-2.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                    <p className="text-xs text-white/90 italic font-medium leading-snug">
                      "Your business has potential. But is your online presence showing it?"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* SCENE 2: THE TRANSFORMATION (5 - 11 SECONDS) */}
            {/* Modern website appearing across laptop, tablet, smartphone with luxury typography */}
            {/* ------------------------------------------------------------------ */}
            {currentTime >= 4.8 && currentTime < 11.2 && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between p-6 transition-all duration-700 ${
                  activeSceneIndex === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                data-testid="scene-2"
              >
                {/* Background Electric Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#040817] via-[#070e28] to-[#02040b] -z-10">
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent-cyan/15 rounded-full blur-[100px]"></div>
                  {/* Light beams */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-cyan/10 via-transparent to-transparent"></div>
                </div>

                {/* Title */}
                <div className="mt-20 w-full text-center z-20 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 uppercase animate-pulse">
                    Scene 02 • The Evolution
                  </span>
                  <h2
                    className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight uppercase"
                    data-testid="scene-2-title"
                  >
                    TURN YOUR IDEAS INTO <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-300 to-white">
                      DIGITAL EXPERIENCES.
                    </span>
                  </h2>
                </div>

                {/* Multidevice Mockup Composition: Laptop + Tablet + Smartphone */}
                <div className="relative w-full h-[260px] my-auto z-20 flex items-center justify-center">
                  {/* LAPTOP (Center Back) */}
                  <div className="absolute w-[240px] transform -translate-y-4 rounded-xl bg-[#0d1222] border border-accent-cyan/40 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(0,240,255,0.2)] overflow-hidden transition-all duration-500">
                    <div className="h-4 bg-[#141b33] flex items-center px-2 gap-1 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="text-[7px] text-white/60 font-mono ml-1">{businessName.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                    {/* Modern Luxury Web UI */}
                    <div className="p-2 space-y-1.5 bg-gradient-to-br from-[#0a0f24] to-[#04060e] text-white">
                      <div className="flex justify-between items-center text-[7px] border-b border-white/10 pb-1">
                        <span className="font-extrabold text-accent-cyan tracking-wider">{businessName}</span>
                        <div className="flex gap-1.5 text-[6px] text-white/70">
                          <span>Portfolio</span>
                          <span>Works</span>
                          <span>Pricing</span>
                        </div>
                      </div>
                      <div className="py-2 text-center space-y-0.5">
                        <div className="text-[9px] font-black tracking-wide text-white">REDEFINING DIGITAL LUXURY</div>
                        <div className="text-[6px] text-accent-cyan font-mono tracking-widest">BESPOKE ARCHITECTURE & DEV</div>
                        <button className="px-2 py-0.5 rounded bg-accent-cyan text-[#040817] text-[6px] font-bold shadow-md shadow-accent-cyan/30 mt-1">
                          Explore Experience
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-1 pt-1">
                        <div className="h-8 rounded bg-white/5 border border-white/10 p-1 flex flex-col justify-end">
                          <span className="text-[5px] text-white/50">STUDIO</span>
                        </div>
                        <div className="h-8 rounded bg-accent-cyan/10 border border-accent-cyan/30 p-1 flex flex-col justify-end">
                          <span className="text-[5px] text-accent-cyan font-bold">ACTIVE</span>
                        </div>
                        <div className="h-8 rounded bg-white/5 border border-white/10 p-1 flex flex-col justify-end">
                          <span className="text-[5px] text-white/50">PRO</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TABLET (Left Front) */}
                  <div className="absolute -left-2 bottom-3 w-[125px] h-[155px] rounded-xl bg-[#090d1c] border-2 border-white/20 shadow-2xl p-1 z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="w-full h-full rounded-lg bg-[#050814] p-1.5 flex flex-col justify-between border border-accent-cyan/20">
                      <div className="flex items-center justify-between text-[6px]">
                        <span className="font-bold text-accent-cyan">IPAD PRO</span>
                        <Zap className="w-2 h-2 text-accent-cyan" />
                      </div>
                      <div className="space-y-1">
                        <div className="w-8 h-1 bg-white/30 rounded"></div>
                        <div className="text-[7px] font-bold text-white leading-tight">Elevated Typography & Micro-actions</div>
                        <div className="w-full h-10 rounded bg-gradient-to-r from-accent-cyan/20 to-blue-600/20 border border-white/10"></div>
                      </div>
                      <span className="text-[5px] font-mono text-white/40">100% RESPONSIVE</span>
                    </div>
                  </div>

                  {/* SMARTPHONE (Right Front) */}
                  <div className="absolute -right-1 bottom-0 w-[95px] h-[170px] rounded-2xl bg-[#0a0f26] border-2 border-accent-cyan/50 shadow-2xl p-1 z-30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="w-full h-full rounded-xl bg-[#02050f] p-1.5 flex flex-col justify-between overflow-hidden">
                      <div className="flex justify-between items-center text-[5px] text-white/60">
                        <span>9:41</span>
                        <span className="text-accent-cyan">5G</span>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="w-5 h-5 mx-auto rounded-full bg-accent-cyan/20 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-accent-cyan" />
                        </div>
                        <div className="text-[6px] font-black text-white">{businessName}</div>
                        <div className="text-[5px] text-accent-cyan">Mobile Mastery</div>
                      </div>
                      <div className="p-1 rounded bg-white/10 text-center text-[5px] text-white font-semibold">
                        Instant Load
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Voiceover caption */}
                <div className="mb-20 z-20 w-full text-center px-2">
                  <div className="glass-card px-4 py-2.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                    <p className="text-xs text-white/90 italic font-medium leading-snug">
                      "We transform your ideas into beautiful, modern websites designed to make an impression."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* SCENE 3: THE EXPERIENCE (11 - 18 SECONDS) */}
            {/* Showcase business websites, online stores, portfolios, and landing pages */}
            {/* ------------------------------------------------------------------ */}
            {currentTime >= 10.8 && currentTime < 18.2 && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between p-6 transition-all duration-700 ${
                  activeSceneIndex === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                data-testid="scene-3"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-[#040715] -z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-purple/15 rounded-full blur-[100px]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                </div>

                {/* Title */}
                <div className="mt-20 w-full text-center z-20 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 uppercase animate-pulse">
                    Scene 03 • Versatility & Craft
                  </span>
                  <h2
                    className="text-base sm:text-lg font-black tracking-tight text-white leading-tight uppercase"
                    data-testid="scene-3-title"
                  >
                    MODERN DESIGN. SMART FUNCTIONALITY. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-white to-accent-purple">
                      PROFESSIONAL RESULTS.
                    </span>
                  </h2>
                </div>

                {/* Interactive Dynamic Categories Pills */}
                <div className="z-30 flex gap-1.5 overflow-x-auto no-scrollbar w-full justify-center px-1">
                  {[
                    { key: 'business', label: 'Business Web', icon: Briefcase },
                    { key: 'store', label: 'Online Store', icon: ShoppingBag },
                    { key: 'portfolio', label: 'Portfolio', icon: Compass },
                    { key: 'landing', label: 'Landing Page', icon: Layers },
                  ].map((cat, i) => {
                    const isSelected = scene3ActiveIndex === i;
                    const IconComponent = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          handleSeek(11 + i * 1.75);
                          setInteractiveCategory(cat.key as any);
                        }}
                        className={`px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-accent-cyan text-dark shadow-md shadow-accent-cyan/30 scale-105'
                            : 'bg-white/10 text-white/60 hover:text-white border border-white/5'
                        }`}
                      >
                        <IconComponent className="w-3 h-3" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Realistic Device Showcase Box */}
                <div className="relative w-full max-w-[310px] my-auto z-20">
                  {/* Category 1: Luxury Corporate Business Website */}
                  {scene3ActiveIndex === 0 && (
                    <div className="animate-fadeIn transition-all duration-300 rounded-2xl bg-gradient-to-br from-[#0c1329] to-[#040817] border border-white/15 p-3 shadow-2xl space-y-2">
                      <div className="flex items-center justify-between text-[8px] text-accent-cyan font-mono border-b border-white/10 pb-1.5">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> ENTERPRISE SUITE
                        </span>
                        <span className="bg-accent-cyan/10 px-1.5 py-0.5 rounded text-[7px]">High Conversion</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-accent-cyan/20 flex items-center justify-center font-bold text-[8px] text-accent-cyan">
                            PV
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-white">{businessName} Global</div>
                            <div className="text-[6px] text-white/50">Strategic Advisory & Digital Architecture</div>
                          </div>
                        </div>
                        <div className="text-[8px] text-white/80 leading-relaxed font-light">
                          "Next-generation digital headquarters tailored for premium engagement and qualified lead generation."
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[7px]">
                          <div className="p-1.5 rounded bg-black/40 border border-white/5 text-center">
                            <span className="text-accent-cyan font-bold block">+340%</span>
                            <span className="text-white/40 text-[6px]">Client Trust</span>
                          </div>
                          <div className="p-1.5 rounded bg-black/40 border border-white/5 text-center">
                            <span className="text-white font-bold block">&lt; 0.6s</span>
                            <span className="text-white/40 text-[6px]">Fast CDN</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category 2: Sleek Online Store (E-Commerce) */}
                  {scene3ActiveIndex === 1 && (
                    <div className="animate-fadeIn transition-all duration-300 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#030712] border border-accent-cyan/30 p-3 shadow-2xl space-y-2">
                      <div className="flex items-center justify-between text-[8px] text-accent-cyan font-mono border-b border-white/10 pb-1.5">
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" /> BOUTIQUE E-COMMERCE
                        </span>
                        <span className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded text-[7px]">Apple Pay Ready</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex gap-2">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-tr from-accent-cyan/30 to-purple-600/30 flex items-center justify-center text-xs">
                            💎
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-[10px] font-bold text-white">Signature Collection 01</div>
                            <div className="text-[8px] text-accent-cyan font-mono">$1,850.00 USD</div>
                            <div className="flex gap-1">
                              <span className="px-1 py-0.5 rounded bg-white/10 text-[6px]">Cart Checkout</span>
                              <span className="px-1 py-0.5 rounded bg-white/10 text-[6px]">Inventory Sync</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-full py-1.5 rounded-lg bg-accent-cyan text-[#030712] font-black text-[8px] tracking-wider uppercase">
                          Seamless Stripe Checkout
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Category 3: Minimalist Creative Portfolio */}
                  {scene3ActiveIndex === 2 && (
                    <div className="animate-fadeIn transition-all duration-300 rounded-2xl bg-gradient-to-br from-[#111625] to-[#040711] border border-white/20 p-3 shadow-2xl space-y-2">
                      <div className="flex items-center justify-between text-[8px] text-purple-300 font-mono border-b border-white/10 pb-1.5">
                        <span className="flex items-center gap-1">
                          <Compass className="w-3 h-3" /> CREATIVE PORTFOLIO
                        </span>
                        <span className="bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded text-[7px]">Curated</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-20 rounded-xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-white/10 p-2 flex flex-col justify-between">
                          <span className="text-[7px] text-white/50">ARCH 01</span>
                          <span className="text-[8px] font-bold text-white">Modern Villa Horizon</span>
                        </div>
                        <div className="h-20 rounded-xl bg-gradient-to-br from-blue-900/40 to-slate-900 border border-white/10 p-2 flex flex-col justify-between">
                          <span className="text-[7px] text-white/50">BRAND 02</span>
                          <span className="text-[8px] font-bold text-white">Monolith Visuals</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category 4: High-Converting Landing Page */}
                  {scene3ActiveIndex === 3 && (
                    <div className="animate-fadeIn transition-all duration-300 rounded-2xl bg-gradient-to-br from-[#0c142c] to-[#020511] border border-accent-cyan/40 p-3 shadow-2xl space-y-2">
                      <div className="flex items-center justify-between text-[8px] text-accent-cyan font-mono border-b border-white/10 pb-1.5">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" /> SAAS & SERVICES
                        </span>
                        <span className="bg-accent-cyan/20 text-accent-cyan px-1.5 py-0.5 rounded text-[7px]">Lead Magnet</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center space-y-1.5">
                        <div className="text-[11px] font-black text-white">Automate Your Acquisition Flow</div>
                        <div className="text-[7px] text-white/60">Designed with modern analytics and frictionless booking.</div>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <div className="px-3 py-1 bg-white text-dark font-extrabold text-[7px] rounded-md">
                            Schedule Intro
                          </div>
                          <div className="px-3 py-1 bg-white/10 text-white font-semibold text-[7px] rounded-md border border-white/10">
                            View Case Study
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtitle / Voiceover caption */}
                <div className="mb-20 z-20 w-full text-center px-2">
                  <div className="glass-card px-4 py-2.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                    <p className="text-xs text-white/90 italic font-medium leading-snug">
                      "From business websites to online stores, we help bring your brand to life online."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* SCENE 4: THE BRAND REVEAL (18 - 22 SECONDS) */}
            {/* Dark navy background, glowing light sweep effects, reveal brand name */}
            {/* ------------------------------------------------------------------ */}
            {currentTime >= 17.8 && currentTime < 22.2 && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between p-6 transition-all duration-700 ${
                  activeSceneIndex === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                data-testid="scene-4"
              >
                {/* Deep Luxury Navy Canvas with intense neon light flare */}
                <div className="absolute inset-0 bg-[#020514] -z-10 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/25 rounded-full blur-[110px] animate-pulse"></div>
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent shadow-[0_0_25px_#00f0ff] animate-ping"></div>
                  {/* Subtle luxury geometric grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
                </div>

                {/* Top Text */}
                <div className="mt-20 w-full text-center z-20 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 uppercase animate-pulse">
                    Scene 04 • The Identity
                  </span>
                  <h2
                    className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight uppercase"
                    data-testid="scene-4-title"
                  >
                    YOUR DIGITAL PRESENCE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-white to-blue-300">
                      STARTS HERE.
                    </span>
                  </h2>
                </div>

                {/* Spectacular Brand Reveal Card */}
                <div className="relative my-auto z-20 flex flex-col items-center text-center space-y-4">
                  {/* Glowing insignia badge */}
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan via-blue-600 to-indigo-900 p-0.5 shadow-[0_0_50px_rgba(0,240,255,0.4)] animate-bounce">
                    <div className="w-full h-full bg-[#030617] rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-accent-cyan animate-pulse" />
                    </div>
                  </div>

                  {/* Sophisticated Typography Brand Reveal */}
                  <div className="space-y-1">
                    <h1
                      className="text-3xl sm:text-4xl font-black tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] uppercase"
                      data-testid="brand-name-reveal"
                    >
                      {businessName}
                    </h1>
                    <p className="text-[11px] font-mono text-accent-cyan tracking-[0.25em] uppercase font-semibold">
                      ARCHITECTS OF DIGITAL PRESTIGE
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-accent-cyan"></span>
                    <span className="text-[9px] font-sans text-white/70 tracking-widest uppercase">
                      EST. MMXXV • WORLDWIDE
                    </span>
                    <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-accent-cyan"></span>
                  </div>
                </div>

                {/* Subtitle / Voiceover caption */}
                <div className="mb-20 z-20 w-full text-center px-2">
                  <div className="glass-card px-4 py-2.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                    <p className="text-xs text-white/90 italic font-medium leading-snug">
                      "Let's build something extraordinary together."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* SCENE 5: CALL TO ACTION (22 - 25 SECONDS) */}
            {/* Laptop mockup, brand name and Instagram contact details, DM US TODAY */}
            {/* ------------------------------------------------------------------ */}
            {currentTime >= 21.8 && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between p-6 transition-all duration-700 ${
                  activeSceneIndex === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                data-testid="scene-5"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-[#020512] -z-10">
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent-cyan/20 rounded-full blur-[100px]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:18px_18px] opacity-20"></div>
                </div>

                {/* Top Call to Action Heading */}
                <div className="mt-20 w-full text-center z-20 space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 uppercase animate-pulse">
                    Scene 05 • The Grand Finale
                  </span>
                  <div className="space-y-1" data-testid="scene-5-cta">
                    <div className="text-lg font-bold text-white/80 tracking-wide uppercase">
                      NEED A WEBSITE?
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight uppercase">
                      LET’S BUILD YOURS.
                    </div>
                    <div className="text-xl font-black text-accent-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.6)] uppercase animate-pulse">
                      DM US TODAY.
                    </div>
                  </div>
                </div>

                {/* Sleek Laptop Mockup with Contact & Instagram Card */}
                <div className="relative w-full max-w-[280px] my-auto z-20">
                  <div className="bg-[#0b1022] rounded-xl border border-accent-cyan/40 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(0,240,255,0.25)] space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-accent-cyan to-blue-500 flex items-center justify-center text-[8px] font-bold text-dark">
                          ✦
                        </div>
                        <span className="text-[9px] font-black text-white">{businessName}</span>
                      </div>
                      <span className="text-[7px] text-accent-cyan font-mono bg-accent-cyan/10 px-1.5 py-0.5 rounded border border-accent-cyan/20">
                        ACCEPTING NEW PROJECTS
                      </span>
                    </div>

                    {/* Instagram Handle & Direct Action Box */}
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[8px]">
                        <span className="text-white/60">Official Instagram:</span>
                        <span className="font-mono text-accent-cyan font-bold" data-testid="instagram-contact-handle">
                          {instagramHandle}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[8px]">
                        <span className="text-white/60">Services:</span>
                        <span className="text-white font-semibold">{industryFocus}</span>
                      </div>

                      {/* CTA Direct Message Button */}
                      <button
                        onClick={() => alert(`Direct Message sent to ${instagramHandle}! Let's build your website.`)}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-accent-cyan to-blue-500 text-dark font-black text-[9px] tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-accent-cyan/30 hover:brightness-110 active:scale-95 transition"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Direct Message</span>
                      </button>
                    </div>

                    <div className="text-center text-[7px] text-white/50 font-mono">
                      Fast Turnaround • Bespoke Code • 100% SEO Optimized
                    </div>
                  </div>

                  {/* Laptop base reflection */}
                  <div className="w-full h-2.5 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 rounded-b-xl shadow-lg flex justify-center">
                    <div className="w-10 h-1 bg-gray-900 rounded-b-sm"></div>
                  </div>
                </div>

                {/* Subtitle / Voiceover caption */}
                <div className="mb-20 z-20 w-full text-center px-2">
                  <div className="glass-card px-4 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                    <p className="text-xs text-white/90 italic font-medium leading-snug">
                      "Message us today and take your business online."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================================================================== */}
          {/* INSTAGRAM REEL OVERLAY CONTROLS (Right Sidebar & Bottom Info) */}
          {/* ==================================================================== */}
          {/* Right Floating Social Engagement Bar */}
          <div className="absolute right-3 bottom-24 z-40 flex flex-col items-center gap-4 text-white">
            <button className="flex flex-col items-center gap-0.5 group">
              <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/40 transition">
                <Heart className="w-5 h-5 group-hover:text-red-400 transition" />
              </div>
              <span className="text-[9px] font-mono font-semibold">14.8K</span>
            </button>

            <button className="flex flex-col items-center gap-0.5 group">
              <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-accent-cyan/20 group-hover:border-accent-cyan/40 transition">
                <MessageCircle className="w-5 h-5 group-hover:text-accent-cyan transition" />
              </div>
              <span className="text-[9px] font-mono font-semibold">892</span>
            </button>

            <button className="flex flex-col items-center gap-0.5 group">
              <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono font-semibold">Share</span>
            </button>

            <button className="flex flex-col items-center gap-0.5 group">
              <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition">
                <Bookmark className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Reel Bottom Creator Badge & Music Ticker */}
          <div className="absolute bottom-5 inset-x-4 z-40 flex flex-col gap-1.5 text-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent-cyan via-blue-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-[#0a0f24] flex items-center justify-center font-bold text-[9px] text-accent-cyan">
                  {businessName.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="font-extrabold text-xs tracking-wide">{instagramHandle}</span>
              <span className="px-2 py-0.5 rounded-full bg-accent-cyan text-dark font-extrabold text-[8px] uppercase tracking-wider">
                Follow
              </span>
            </div>

            {/* Audio track ticker */}
            <div className="flex items-center gap-1.5 text-[9px] text-white/70 font-mono">
              <Sparkles className="w-3 h-3 text-accent-cyan animate-spin" />
              <span className="truncate">
                Original Audio • {businessName} – Cinematic Electronic Score (25s)
              </span>
            </div>
          </div>
        </div>

        {/* REEL CONTROLS BAR UNDERNEATH THE SMARTPHONE */}
        <div className="mt-4 w-full max-w-[420px] glass-card p-3 rounded-2xl border border-white/10 flex flex-col gap-2">
          {/* Timeline scrub input */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/60 w-8">
              {currentTime.toFixed(1)}s
            </span>
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="flex-1 accent-accent-cyan h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-white/40">25.0s</span>
          </div>

          {/* Playback action buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-accent-cyan text-dark font-bold hover:bg-accent-cyan/90 transition shadow-md shadow-accent-cyan/20"
                title={isPlaying ? 'Pause' : 'Play'}
                data-testid="reel-play-toggle"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition border border-white/10"
                title="Restart From Scene 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCustomizerOpen(!customizerOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                  customizerOpen
                    ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                    : 'bg-white/10 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-dark/80 border border-white/10 text-[10px] text-white/80 rounded-lg px-2 py-1.5"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1.0x (Normal)</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2.0x</option>
              </select>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition border border-white/10"
                title="Fullscreen Toggle"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: SCENE TIMELINE INSPECTOR & BRAND CUSTOMIZATION PANEL */}
      <div className="flex-1 w-full max-w-xl space-y-5">
        {/* Top Header Card */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-white tracking-wide">
                  Luxury Cinematic Reel Engine
                </h3>
                <p className="text-white/40 text-xs font-mono">
                  9:16 Vertical • 25 Seconds • 5 Master Scenes
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 animate-pulse">
              LIVE PREVIEW
            </span>
          </div>

          <p className="text-white/70 text-xs leading-relaxed">
            Engineered precisely according to luxury cinematic technology commercial standards.
            Includes synchronized electronic audio pads, authoritative female voiceover cadence,
            photorealistic multi-device mockups, and bold typographic transitions.
          </p>
        </div>

        {/* Customization Drawer / Settings */}
        {customizerOpen && (
          <div className="glass-card p-5 rounded-3xl border border-accent-cyan/30 bg-[#090d1f]/90 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent-cyan" /> Customize Reel Branding
              </h4>
              <span className="text-[10px] text-white/50 font-mono">Updates live in player</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-white/60 font-semibold text-[11px]">Business / Brand Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-cyan outline-none"
                  placeholder="e.g. LUMINA DIGITAL"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-semibold text-[11px]">Instagram Handle</label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-cyan outline-none"
                  placeholder="e.g. @lumina.digital"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-white/60 font-semibold text-[11px]">Website Specialization Focus</label>
                <input
                  type="text"
                  value={industryFocus}
                  onChange={(e) => setIndustryFocus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-cyan outline-none"
                  placeholder="e.g. Luxury Design, Architecture & Tech"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5 SCENES INTERACTIVE TIMELINE SCRUBBER LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/50">
              Interactive 5-Scene Sequence (25s Timeline)
            </h4>
            <span className="text-[11px] text-accent-cyan font-mono">Click any scene to jump</span>
          </div>

          <div className="space-y-2">
            {SCENES.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <div
                  key={scene.id}
                  onClick={() => handleSeek(scene.start)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-cyan/15 via-[#0e1633] to-transparent border-accent-cyan/60 shadow-lg shadow-accent-cyan/10 translate-x-1.5'
                      : 'bg-dark/40 hover:bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                  data-testid={`scene-step-${scene.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                          isActive
                            ? 'bg-accent-cyan text-dark shadow-md shadow-accent-cyan/30'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        0{scene.id}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{scene.name}</h5>
                          <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/10 px-1.5 py-0.5 rounded">
                            {scene.start}s – {scene.end}s
                          </span>
                        </div>
                        <p className="text-white/60 text-[11px] mt-0.5 font-sans leading-snug">
                          {scene.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-white/40 block">
                        {scene.duration}s
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-bold text-accent-cyan uppercase tracking-wider animate-pulse">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Synchronized voiceover quote badge */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-start gap-1.5 text-[11px] text-white/80 italic">
                    <span className="text-accent-cyan not-italic">🎙️</span>
                    <span>"{scene.voiceover}"</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Production Requirements Compliance Checklist */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
          <h5 className="text-xs font-mono uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" /> Production Requirements Met
          </h5>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-white/70">
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> 9:16 vertical ratio (1080 × 1920 scaled)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> Exactly 25 seconds runtime
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> Navy, black, white & electric blue
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> Professional female voiceover
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> Realistic multi-device mockups
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> Electronic cinematic background music
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryReelAd;
