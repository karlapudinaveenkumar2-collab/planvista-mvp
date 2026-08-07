import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface TourStep {
  targetId: string;
  page: 'home' | 'dashboard' | 'cad' | 'three' | 'ai' | 'pm' | 'cost' | 'reports' | 'contact' | 'about' | 'settings' | 'investor';
  title: string;
  text: string;
  explanation: string;
  action: 'wave' | 'point' | 'explain' | 'fly' | 'tilt' | 'walk';
  expression: 'happy' | 'thinking' | 'focused' | 'excited';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'home',
    page: 'home',
    title: 'The Home of PlanVista',
    text: 'Let us begin with our main landing page.',
    explanation: 'This is where global corporations and visionaries meet next-generation CAD capabilities. We provide instant design launching and a gateway to book customized corporate live demonstrations.',
    action: 'wave',
    expression: 'happy',
  },
  {
    targetId: 'dashboard',
    page: 'dashboard',
    title: 'PlanVista Control Dashboard',
    text: 'Now, let us examine the Dashboard.',
    explanation: 'This is your mission control. It aggregates active construction blueprints, real-time AI recommendations, direct access to cloud files, and monitors real-world site construction progress metrics.',
    action: 'explain',
    expression: 'happy',
  },
  {
    targetId: 'cad',
    page: 'cad',
    title: 'Professional 2D CAD drafting',
    text: 'This is the 2D CAD drafting board.',
    explanation: 'Here, engineers and architects can sketch solid walls, add rooms, customize doors, and integrate smart grid snap tools. You can also prompt me to instantly synthesize floor plan schemes for you!',
    action: 'point',
    expression: 'focused',
  },
  {
    targetId: 'three',
    page: 'three',
    title: 'Cinematic 3D Visualization',
    text: 'Let us switch to the 3D Render Workspace.',
    explanation: 'With a single click, your 2D blueprints are extruded into photo-realistic 3D buildings. You can fly around, rotate structures, change materials, and simulate real-time shadows and day/night lighting cycles.',
    action: 'fly',
    expression: 'excited',
  },
  {
    targetId: 'ai',
    page: 'ai',
    title: 'The AI Design Co-Pilot',
    text: 'Meet our AI Assistant.',
    explanation: 'This panel processes architectural designs instantly to detect safety mistakes, recommend room layout optimization, reduce active material costs, and boost your overall sustainability score.',
    action: 'explain',
    expression: 'thinking',
  },
  {
    targetId: 'pm',
    page: 'pm',
    title: 'Enterprise Project Management',
    text: 'Let us move to Project Management.',
    explanation: 'Track corporate construction sprints, allocate tasks to regional engineers, verify project milestones, and manage complex material budget sheets with seamless ease.',
    action: 'point',
    expression: 'focused',
  },
  {
    targetId: 'cost',
    page: 'cost',
    title: 'Real-Time Cost Estimation & BOQ',
    text: 'Here is our automated financial panel.',
    explanation: 'This generates complete Bills of Quantities, calculating material and labor costs instantly. It also supports exporting beautiful premium PDF and Excel sheets for investor reviews.',
    action: 'explain',
    expression: 'happy',
  },
  {
    targetId: 'reports',
    page: 'reports',
    title: 'AI Structural & Energy Analytics',
    text: 'Let us explore our AI Analytical Reports.',
    explanation: 'Generate premium certified technical sheets, covering solar energy insulation, structural stress, carbon footprint, and detailed safety compliance diagnostics.',
    action: 'point',
    expression: 'thinking',
  },
  {
    targetId: 'contact',
    page: 'contact',
    title: 'Corporate Contact Center',
    text: 'And here is the contact portal.',
    explanation: 'If you would like to partner with our development squad or schedule a customized enterprise demonstration, our contact form, business coordinates, and 24/7 AI chat are ready for you here.',
    action: 'wave',
    expression: 'happy',
  },
  {
    targetId: 'about',
    page: 'about',
    title: 'Our Architectural Manifesto',
    text: 'Allow me to share our About Section.',
    explanation: 'This displays PlanVista’s global vision, founding technology stacks, and our ambitious future roadmap of expansion into autonomous AI-designed city centers.',
    action: 'tilt',
    expression: 'thinking',
  },
  {
    targetId: 'settings',
    page: 'settings',
    title: 'Customized Platform Settings',
    text: 'Here is your settings panel.',
    explanation: 'Toggle dark mode, adjust the speech synthesis speed, manage profile credentials, and configure continuous automated local cloud backups.',
    action: 'point',
    expression: 'focused',
  },
  {
    targetId: 'investor',
    page: 'investor',
    title: 'Investor Mode & Keynote Pitch',
    text: 'Finally, our exclusive Investor Mode.',
    explanation: 'This is my premium corporate presentation where I detail our business model, market size, key differentiators, and future roadmap. A true high-end pitch perfect for international venture capital partners.',
    action: 'explain',
    expression: 'excited',
  },
];

interface GuidedTourProps {
  onStepChange: (page: 'home' | 'dashboard' | 'cad' | 'three' | 'ai' | 'pm' | 'cost' | 'reports' | 'contact' | 'about' | 'settings' | 'investor') => void;
  speak: (text: string, callback?: () => void) => void;
  onClose: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ onStepChange, speak, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const step = TOUR_STEPS[currentStepIndex];

  useEffect(() => {
    if (!isPlaying) return;

    // Trigger page navigation
    onStepChange(step.page);

    // Speak explanation
    speak(`${step.text} ${step.explanation}`, () => {
      // Auto-advance to next step if playing
      if (currentStepIndex < TOUR_STEPS.length - 1) {
        const nextTimer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 1500);
        return () => clearTimeout(nextTimer);
      } else {
        setIsPlaying(false);
        speak("We have completed the guided tour of PlanVista. I will now position myself in the bottom corner of your workspace to assist you on-demand.", () => {
          onClose();
        });
      }
    });
  }, [currentStepIndex, isPlaying, onStepChange, speak, step]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] max-w-sm glass-card border-accent-cyan/30 rounded-2xl p-5 glow-border-cyan shadow-xl animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-accent-cyan rounded-full animate-ping"></span>
          <p className="text-accent-cyan font-mono text-xs uppercase tracking-widest">KK Guided Tour</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white font-mono text-xs px-2 py-0.5 rounded border border-white/10 hover:border-white/20"
        >
          Skip
        </button>
      </div>

      <h4 className="text-white font-bold text-base mb-1">{step.title}</h4>
      <p className="text-white/80 text-xs mb-4 leading-relaxed">{step.explanation}</p>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1 rounded-full mb-4 overflow-hidden">
        <div
          className="bg-accent-cyan h-full transition-all duration-500"
          style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg border text-xs flex items-center justify-center ${
              isPlaying
                ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {isPlaying ? 'Pause Auto-Play' : 'Play Auto-Play'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-white" />
          </button>
          <span className="text-white/50 text-xs font-mono">
            {currentStepIndex + 1}/{TOUR_STEPS.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold border border-accent-cyan"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export { TOUR_STEPS };
