import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Play,
  TrendingUp,
  FileCheck,
  Bell,
  Cpu,
  Download,
  Users,
  Search,
  Sparkles,
  CloudLightning,
  AlertTriangle,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToCAD: () => void;
  onNavigateToThree: () => void;
  speak: (text: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToCAD,
  onNavigateToThree,
  speak,
}) => {
  const [search, setSearch] = useState('');

  const projects = [
    { name: 'Laguna Hills Corporate Plaza', type: 'Commercial', progress: 85, status: 'Active', updated: '2 hours ago' },
    { name: 'The Onyx Residential Villa', type: 'Residential', progress: 100, status: 'Saved', updated: '1 day ago' },
    { name: 'Aurora Eco-Sustainable Habitat', type: 'Residential', progress: 42, status: 'Active', updated: 'Just now' },
  ];

  const handleCreateNew = () => {
    speak("Creating a new architectural project container. Launching 2D CAD blueprint board.");
    onNavigateToCAD();
  };

  return (
    <div className="w-full pb-20 animate-fade-in" id="dashboard">
      {/* Header and Quick stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Dashboard</h2>
          <p className="text-white/40 text-xs mt-1">Unified CAD drafting progress metrics & AI suggestions</p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, CAD models, or AI files..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Quick Stats */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-accent-cyan">
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Active Blueprints</p>
          <p className="text-2xl font-bold mt-1">14</p>
          <div className="flex items-center gap-1 text-[10px] text-green-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 added this fiscal week</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-accent-purple">
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Completed Renderings</p>
          <p className="text-2xl font-bold mt-1">32</p>
          <p className="text-[10px] text-white/40 mt-2">Ready in AWS Cloud Storage</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-orange-400">
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Site Construction Progress</p>
          <p className="text-2xl font-bold mt-1">64.8%</p>
          <p className="text-[10px] text-white/40 mt-2">Corresponds with Gantt Milestones</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-green-400">
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Global Team Members</p>
          <p className="text-2xl font-bold mt-1">8 Partners</p>
          <p className="text-[10px] text-white/40 mt-2">Active in collaborative editor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main section: Recent projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Folder className="w-4.5 h-4.5 text-accent-cyan" />
                <span>Recent Projects</span>
              </h3>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 rounded-lg bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl transition duration-300"
                >
                  <div>
                    <h4 className="text-white text-xs font-semibold">{proj.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/40 font-mono">
                      <span>{proj.type}</span>
                      <span>•</span>
                      <span>Modified {proj.updated}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-accent-cyan h-full" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-mono text-accent-cyan w-8 text-right">{proj.progress}%</span>

                    <div className="flex gap-1.5">
                      <button
                        onClick={onNavigateToCAD}
                        className="px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-[10px] font-mono"
                      >
                        2D CAD
                      </button>
                      <button
                        onClick={onNavigateToThree}
                        className="px-2.5 py-1.5 rounded-md bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan text-[10px] font-mono flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>3D Render</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-4">Quick Corporate Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={onNavigateToCAD}
                className="p-4 bg-white/5 border border-white/5 hover:border-accent-cyan/40 rounded-xl text-center group transition"
              >
                <Cpu className="w-5 h-5 text-accent-cyan mx-auto mb-2" />
                <span className="text-white text-[11px] font-medium block">Create Villa Blueprint</span>
              </button>

              <button
                onClick={() => speak("Simulating instant daytime structural lighting analysis.")}
                className="p-4 bg-white/5 border border-white/5 hover:border-accent-cyan/40 rounded-xl text-center group transition"
              >
                <CloudLightning className="w-5 h-5 text-accent-purple mx-auto mb-2" />
                <span className="text-white text-[11px] font-medium block">Analyze Energy Load</span>
              </button>

              <button
                onClick={() => {
                  speak("Exporting general Bill of Quantities spreadsheet.");
                  alert("BOQ downloaded successfully in Excel format.");
                }}
                className="p-4 bg-white/5 border border-white/5 hover:border-accent-cyan/40 rounded-xl text-center group transition"
              >
                <Download className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                <span className="text-white text-[11px] font-medium block">Download Excel BOQ</span>
              </button>

              <button
                onClick={() => speak("Opening secure team collaboration room. Active members: 8")}
                className="p-4 bg-white/5 border border-white/5 hover:border-accent-cyan/40 rounded-xl text-center group transition"
              >
                <Users className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <span className="text-white text-[11px] font-medium block">Manage Design Crew</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: AI Suggestions and Notifications */}
        <div className="space-y-6">
          {/* AI Suggestions Box */}
          <div className="glass-card rounded-2xl p-5 border border-accent-cyan/20 bg-gradient-to-br from-accent-cyan/[0.02] to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
              <h4 className="text-white font-bold text-sm">KK AI Suggestions</h4>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              I have thoroughly audited your "Aurora Eco-Sustainable Habitat" blueprint. I discovered 2 optimization points:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-accent-cyan/5 border border-accent-cyan/15 rounded-lg flex gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-white/80 text-[11px] leading-relaxed">
                  <span className="font-semibold text-accent-cyan">Eco Ventilation:</span> Elevate south window width by 15% to increase passive solar warming and cut HVAC power.
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex gap-2">
                <FileCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <p className="text-white/80 text-[11px] leading-relaxed">
                  <span className="font-semibold text-green-400">Foundation Cost:</span> Changing grade 4 steel to composite reduces overall structure cost by $12,400.
                </p>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-white/50" />
                <span>Enterprise Alerts</span>
              </h4>
              <span className="text-[10px] bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded font-mono">2 NEW</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-cyan mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-white text-xs">Architect Johnathan uploaded 'Plumbing-v3.cad'</p>
                  <p className="text-[9px] text-white/40 mt-0.5 font-mono">14 minutes ago</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-cyan mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-white text-xs">Automatic nightly cloud backup completed successfully</p>
                  <p className="text-[9px] text-white/40 mt-0.5 font-mono">6 hours ago</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-transparent mt-1.5 shrink-0 border border-white/20"></span>
                <div>
                  <p className="text-white/60 text-xs">Structural Stress Simulation results calculated</p>
                  <p className="text-[9px] text-white/40 mt-0.5 font-mono">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
