import React from 'react';
import { Sparkles, Calendar, Zap, Compass, ShieldCheck, Flame, ArrowUpRight } from 'lucide-react';

interface HomePageProps {
  onStartDesigning: () => void;
  onBookDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartDesigning, onBookDemo }) => {
  return (
    <div className="w-full relative pb-20 animate-fade-in" id="home">
      {/* Cinematic Hero */}
      <div className="text-center pt-16 pb-12 px-6 max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-[11px] font-mono uppercase tracking-widest mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Architecture Operating System</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Transform Blueprints into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-accent-purple">
            Cinematic 3D Realities
          </span>
        </h1>

        <p className="text-white/60 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Create solid 2D floor plans, extrude instantly to high-fidelity interactive 3D, calculate cost estimates, and manage your building pipeline with your autonomous AI assistant, <span className="text-accent-cyan font-semibold">KK</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartDesigning}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2.5 shadow-lg shadow-accent-cyan/20 group"
          >
            <span>Start Designing Now</span>
            <Zap className="w-4 h-4 group-hover:animate-bounce" />
          </button>
          <button
            onClick={onBookDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition duration-300 hover:border-accent-cyan/50 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-accent-cyan" />
            <span>Book a Premium Demonstration</span>
          </button>
        </div>
      </div>

      {/* Corporate Features Panel */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-5">
            <Compass className="w-6 h-6 text-accent-cyan" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Automated 2D to 3D Extrusion</h3>
          <p className="text-white/55 text-xs leading-relaxed">
            Draft structural walls and layout doors. PlanVista converts geometric vectors into volumetric building assets in milliseconds.
          </p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mb-5">
            <Flame className="w-6 h-6 text-accent-purple" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Autonomous Assistant Co-Pilot</h3>
          <p className="text-white/55 text-xs leading-relaxed">
            KK handles complex calculations, checks blueprints for safety codes, schedules milestones, and exports formatted Bill of Quantities spreadsheet logs.
          </p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Enterprise Grade Governance</h3>
          <p className="text-white/55 text-xs leading-relaxed">
            Secure multi-user project synchronization, role permission management, high frequency local backup cycles, and structural security auditing.
          </p>
        </div>
      </div>

      {/* Cinematic Showcase Section */}
      <div className="max-w-6xl mx-auto px-6 mt-20 relative z-10">
        <div className="glass-card rounded-3xl overflow-hidden border-white/5 relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="max-w-md">
            <p className="text-accent-cyan font-mono text-xs uppercase tracking-wider mb-2">Interactive Masterclass</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Our Vision: Infinite Architecture, Streamlined.
            </h2>
            <p className="text-white/50 text-xs leading-relaxed mb-6">
              PlanVista operates as the central nervous system for international real estate developers and AEC enterprises. By unifying structural blueprint drawing, three-dimensional scene physics simulations, and generative smart suggestions, we cut production design bottlenecks by up to 74%.
            </p>
            <button
              onClick={onStartDesigning}
              className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-accent-cyan hover:text-dark border border-white/10 text-white font-semibold text-xs transition duration-300 flex items-center gap-2 group"
            >
              <span>Explore design sandbox</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="w-full md:w-1/2 max-w-md aspect-video glass-card rounded-2xl border-accent-cyan/20 overflow-hidden relative group">
            <div className="absolute inset-0 bg-dark/40 group-hover:bg-transparent transition duration-300 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center animate-pulse">
                <Zap className="w-6 h-6 text-accent-cyan" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-accent-cyan bg-dark/80 px-2 py-1 rounded">
              PLANVISTA PREVIEW FRAME
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
