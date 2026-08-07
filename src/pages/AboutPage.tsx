import React from 'react';
import { Target, Rocket } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const milestones = [
    { year: 'Q1 2025', title: 'Conceptual Genesis', desc: 'Integration of mathematical vector solvers with WebGL render loops.' },
    { year: 'Q3 2025', title: 'PlanVista v1 SDK Launch', desc: 'Introduction of real-time 2D CAD line snaps and interactive walkthrough engines.' },
    { year: 'Q1 2026', title: 'KK Assistant Launch', desc: 'Pioneering voice and chat-based generative architectural suggestions.' },
    { year: 'Future', title: 'City-Scale Autonomy', desc: 'Autonomous district blueprint synthesis based on local ecological constraints.' },
  ];

  return (
    <div className="w-full pb-20 animate-fade-in" id="about">
      {/* Intro section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-accent-cyan font-mono text-xs uppercase tracking-widest bg-accent-cyan/10 px-3 py-1.5 rounded-full border border-accent-cyan/20">
          The Architectural Manifesto
        </span>
        <h2 className="text-4xl font-extrabold text-white mt-5 mb-4 tracking-tight">Our Philosophy & Vision</h2>
        <p className="text-white/65 text-base font-light leading-relaxed">
          PlanVista is a global generative design suite tailored for modern builders, structural engineers, and venture investors. We strive to automate technical drafting friction entirely, allowing architects to design structures at the speed of thought.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {/* Core Vision & Mission */}
        <div className="glass-card rounded-2xl p-6 flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Our Vision</h3>
            <p className="text-white/55 text-xs leading-relaxed">
              To construct a highly responsive, immersive physical modeling ecosystem where machine intelligence coordinates structural safety, daylight optimizations, and real-time financial planning synchronously.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/25 flex items-center justify-center shrink-0">
            <Rocket className="w-6 h-6 text-accent-purple" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Our Mission</h3>
            <p className="text-white/55 text-xs leading-relaxed">
              Equip architects with real-time feedback loops. By bridging the gap between flat blueprints and rich spatial physics, we empower developers to launch structures responsibly with reduced costs and minimized carbon waste.
            </p>
          </div>
        </div>
      </div>

      {/* Technology and Founders */}
      <div className="max-w-5xl mx-auto mb-16">
        <h3 className="text-white font-extrabold text-2xl text-center mb-8">Technical Stack & Founding Core</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-5 text-center">
            <h4 className="text-white font-bold text-base">KK Cognitive Engine</h4>
            <p className="text-accent-cyan font-mono text-[10px] uppercase tracking-wider mt-1 mb-3">AI Operating Core</p>
            <p className="text-white/50 text-xs leading-relaxed">
              Powered by deep semantic understanding models trained on building safety standards, compliance manuals, and construction materials cost logs.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 text-center">
            <h4 className="text-white font-bold text-base">Three.js Graphics</h4>
            <p className="text-accent-purple font-mono text-[10px] uppercase tracking-wider mt-1 mb-3">WebGL Volumetric Render</p>
            <p className="text-white/50 text-xs leading-relaxed">
              Utilizes standard WebGL, offering smooth 60fps structural transformations, material customizers, and physical ray-cast collision bounds.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 text-center">
            <h4 className="text-white font-bold text-base">Collaborative Sync</h4>
            <p className="text-green-400 font-mono text-[10px] uppercase tracking-wider mt-1 mb-3">Multiuser WebSockets</p>
            <p className="text-white/50 text-xs leading-relaxed">
              Synchronizes multi-device drawing coordinates instantly, ensuring engineering team alignment with zero file conflicts.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Roadmap */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-white font-extrabold text-2xl text-center mb-10">Strategic Future Roadmap</h3>

        <div className="relative border-l border-white/10 pl-6 ml-4 space-y-8">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative animate-fade-in">
              {/* Dot */}
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accent-cyan border-4 border-dark flex items-center justify-center"></span>

              <div>
                <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2.5 py-0.5 rounded-full">
                  {m.year}
                </span>
                <h4 className="text-white font-bold text-base mt-2">{m.title}</h4>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AboutPage;
