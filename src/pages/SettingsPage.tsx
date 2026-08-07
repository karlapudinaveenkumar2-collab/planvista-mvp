import React, { useState } from 'react';
import { Settings, Shield, Sliders, User, Sun, Moon } from 'lucide-react';

interface SettingsPageProps {
  onThemeToggle: () => void;
  darkTheme: boolean;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speak: (text: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onThemeToggle,
  darkTheme,
  speechPitch,
  setSpeechPitch,
  speechRate,
  setSpeechRate,
  speak,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'voice' | 'security'>('profile');

  const handleTestSpeech = () => {
    speak("Synchronizing system audio. My vocal pitch is currently configured to perfect friendly parameters.");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in" id="settings">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-accent-cyan" />
        <div>
          <h2 className="text-3xl font-extrabold text-white">Platform Settings</h2>
          <p className="text-white/40 text-xs mt-1">Configure speech synthesis parameters and general account properties</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation panel */}
        <div className="space-y-1.5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition ${
              activeTab === 'profile' ? 'bg-accent-cyan text-dark font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition ${
              activeTab === 'voice' ? 'bg-accent-cyan text-dark font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Voice & Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition ${
              activeTab === 'security' ? 'bg-accent-cyan text-dark font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Local Backup</span>
          </button>
        </div>

        {/* Configurations Column */}
        <div className="md:col-span-3 glass-card rounded-2xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h4 className="text-white font-bold text-base border-b border-white/5 pb-2">Profile Information</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-white/40 font-mono uppercase text-[9px] mb-1.5">User Handle</p>
                  <p className="p-3 bg-white/5 rounded-xl border border-white/5 text-white">Global Partner Enterprise</p>
                </div>
                <div>
                  <p className="text-white/40 font-mono uppercase text-[9px] mb-1.5">Organization Category</p>
                  <p className="p-3 bg-white/5 rounded-xl border border-white/5 text-white">AEC Development Group</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold text-sm mb-3">Vocal Theme Optimization</h4>
                <button
                  onClick={onThemeToggle}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-2 text-xs transition"
                >
                  {darkTheme ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-accent-cyan" />}
                  <span>Toggle {darkTheme ? 'Light Theme Mode' : 'Premium Dark theme'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <h4 className="text-white font-bold text-base border-b border-white/5 pb-2">KK Voice Synthesis Parameters</h4>

              <div className="space-y-4">
                {/* Pitch Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/60">Vocal Tone Pitch</span>
                    <span className="text-accent-cyan font-mono">{speechPitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  />
                  <span className="text-[10px] text-white/30 block mt-1">Recommended: 1.10 (friendly AI robot)</span>
                </div>

                {/* Rate Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/60">Vocal Articulation Speed</span>
                    <span className="text-accent-cyan font-mono">{speechRate.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  />
                  <span className="text-[10px] text-white/30 block mt-1">Recommended: 1.00 (standard presentation pace)</span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleTestSpeech}
                    className="px-4 py-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold text-xs transition duration-300"
                  >
                    Test vocalization
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h4 className="text-white font-bold text-base border-b border-white/5 pb-2">Cloud Local Backup Controls</h4>

              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl flex gap-3">
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <h5 className="text-white text-xs font-semibold">Active Continuous Backup Protection</h5>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                    PlanVista local storage caches all vector drafts automatically in your browser's IndexedDB. Loss of connectivity will not lose current blueprint structures.
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    speak("Initiating full platform safety backup export.");
                    alert("Complete local project directory bundle exported to local storage.");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
                >
                  Export Complete local cache database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
