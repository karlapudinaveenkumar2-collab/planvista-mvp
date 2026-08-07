import React, { useState, useCallback } from 'react';
import { Settings, Sparkles } from 'lucide-react';

import { KKRobotCanvas } from './components/KKRobotCanvas';
import { AudioSynth } from './components/AudioSynth';
import { useVoiceController } from './hooks/useVoiceController';
import { CinematicOpening } from './components/CinematicOpening';
import { GuidedTour } from './components/GuidedTour';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SettingsPage } from './pages/SettingsPage';
import { InvestorMode } from './pages/InvestorMode';

import { CADCanvas2D } from './components/CADCanvas2D';
import type { CADElement } from './components/CADCanvas2D';
import { Workspace3D } from './components/Workspace3D';
import { KKChat } from './components/KKChat';
import { ProjectManagement } from './components/ProjectManagement';
import { CostEstimation } from './components/CostEstimation';
import { AIReports } from './components/AIReports';
import { AIAssistantSidebar } from './components/AIAssistantSidebar';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'home'
    | 'dashboard'
    | 'cad'
    | 'three'
    | 'ai'
    | 'pm'
    | 'cost'
    | 'reports'
    | 'contact'
    | 'about'
    | 'settings'
    | 'investor'
  >('home');

  const [introComplete, setIntroComplete] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [kkMode, setKkMode] = useState<'floating' | 'chat'>('floating');
  const [darkTheme, setDarkTheme] = useState(true);

  // CAD States
  const [cadElements, setCadElements] = useState<CADElement[]>([
    { id: '1', type: 'wall', x1: 200, y1: 150, x2: 500, y2: 150 },
    { id: '2', type: 'wall', x1: 500, y1: 150, x2: 500, y2: 300 },
    { id: '3', type: 'wall', x1: 500, y1: 300, x2: 200, y2: 300 },
    { id: '4', type: 'wall', x1: 200, y1: 300, x2: 200, y2: 150 },
    { id: '5', type: 'window', x1: 300, y1: 150, x2: 400, y2: 150 },
    { id: '6', type: 'door', x1: 350, y1: 300, x2: 410, y2: 300 },
  ]);

  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'kk'; text: string; time: string }[]>([
    { sender: 'kk', text: "Hello! I am KK, your Architecture AI companion. You can type commands here or say them out loud to control your designs.", time: 'Just now' },
  ]);

  // Voice setup (stably wrapped inside useCallback)
  const parseCommand = useCallback((command: string) => {
    const clean = command.toLowerCase().trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: command, time: 'Just now' }]);

    if (clean.includes('create a villa') || clean.includes('create villa')) {
      speak("Command recognized. Automatically drafting a luxury multizone master suite floor plan.");
      setCadElements([
        { id: 'v1', type: 'wall', x1: 150, y1: 100, x2: 550, y2: 100 },
        { id: 'v2', type: 'wall', x1: 550, y1: 100, x2: 550, y2: 350 },
        { id: 'v3', type: 'wall', x1: 550, y1: 350, x2: 150, y2: 350 },
        { id: 'v4', type: 'wall', x1: 150, y1: 350, x2: 150, y2: 100 },
        { id: 'v5', type: 'wall', x1: 350, y1: 100, x2: 350, y2: 350 },
        { id: 'v6', type: 'door', x1: 220, y1: 350, x2: 280, y2: 350 },
        { id: 'v7', type: 'window', x1: 400, y1: 100, x2: 500, y2: 100 },
        { id: 'v8', type: 'furniture', x1: 250, y1: 200, x2: 250, y2: 200, name: 'bed' },
        { id: 'v9', type: 'furniture', x1: 450, y1: 220, x2: 450, y2: 220, name: 'sofa' },
      ]);
      setActiveTab('cad');
    } else if (clean.includes('day mode') || clean.includes('daylight')) {
      speak("Activating diurnal daytime lighting simulation.");
      (window as any).setDayModeToggle?.(true);
    } else if (clean.includes('night mode') || clean.includes('nighttime')) {
      speak("Activating twilight nighttime lighting rendering.");
      (window as any).setDayModeToggle?.(false);
    } else if (clean.includes('download my blueprint') || clean.includes('download blueprint')) {
      speak("Initiating secure vector local download.");
      alert("PlanVista CAD schematic file downloaded successfully.");
    } else if (clean.includes('open 3d workspace') || clean.includes('open 3d')) {
      speak("Switching viewports. Rendering volumetric structures in Three.js.");
      setActiveTab('three');
    } else if (clean.includes('investor mode') || clean.includes('investor')) {
      speak("Opening executive pitch deck mode. Welcome esteemed venture partners.");
      setActiveTab('investor');
    } else {
      speak("I heard your voice command. Let me search my architectural memory database.");
      setChatHistory((prev) => [
        ...prev,
        { sender: 'kk', text: `Vocal command parsed: "${command}". Search query generated.`, time: 'Just now' },
      ]);
    }
  }, []);

  const {
    speak,
    isListening,
    startListening,
    isSpeaking,
    speechPitch,
    setSpeechPitch,
    speechRate,
    setSpeechRate,
  } = useVoiceController(parseCommand);

  // Sidebar triggers for AI Recommendations
  const suggestLayout = () => {
    speak("Synthesizing optimal spatial flow paths for the living areas.");
    setChatHistory((prev) => [
      ...prev,
      { sender: 'kk', text: "AI Layout Suggestion: Orienting the lounge furniture set 45 degrees towards the window opens up 1.5m of fire escape egress clearance.", time: 'Just now' },
    ]);
  };

  const optimizeLighting = () => {
    speak("Running passive solar insulation diagnostics.");
    setChatHistory((prev) => [
      ...prev,
      { sender: 'kk', text: "AI Lighting Audit: South facade windows have been expanded by 10% to capture 2.4kWh of ambient daytime thermal warming.", time: 'Just now' },
    ]);
  };

  const handleReduceCost = () => {
    speak("Scanning cost model ledger for structural optimizations.");
    alert("Reducing costs: Changing secondary interior framing to light wood composite decreases material costs by 15%.");
  };

  const handleImproveSustainability = () => {
    speak("Applying LEED standard green material algorithms.");
    alert("Improving Sustainability: Selecting high insulation cork-wood yields a +14 sustainability score.");
  };

  const handleSendMessage = (msg: string) => {
    parseCommand(msg);
  };

  return (
    <div className={`min-h-screen bg-dark text-white font-sans ${!darkTheme && 'filter invert hue-rotate-180 bg-[#f5f5f7]'}`}>
      <AudioSynth isPlaying={introComplete} />

      {/* Cinematic intro overlay */}
      {!introComplete && (
        <CinematicOpening onComplete={() => setIntroComplete(true)} speak={speak} />
      )}

      {/* Primary Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center font-bold text-dark text-base shadow-lg shadow-accent-cyan/10">
            PV
          </div>
          <div>
            <h1 className="text-white font-black tracking-wider text-sm">PlanVista</h1>
            <p className="text-[9px] font-mono tracking-widest text-accent-cyan uppercase">Premium AI OS</p>
          </div>
        </div>

        {/* Desktop Navbar Menu */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'home', label: 'Home' },
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'cad', label: '2D CAD' },
            { id: 'three', label: '3D Render' },
            { id: 'ai', label: 'AI Assistant' },
            { id: 'pm', label: 'Collaboration' },
            { id: 'cost', label: 'Financials' },
            { id: 'reports', label: 'AI Reports' },
            { id: 'contact', label: 'Contact' },
            { id: 'about', label: 'About' },
            { id: 'investor', label: 'Investor' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                speak(`Navigating to PlanVista ${item.label} section.`);
              }}
              className={`px-3.5 py-2 rounded-lg transition duration-300 ${
                activeTab === item.id
                  ? 'bg-accent-cyan text-dark font-extrabold shadow-md shadow-accent-cyan/15'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Global Controls HUD */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setTourOpen(true);
              speak("Initiating automated keynote presentation demonstration guide. Follow me!");
            }}
            className="px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-bold hover:bg-accent-cyan hover:text-dark transition duration-300 flex items-center gap-1.5 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guided Tour</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              speak("Opening local audio and speech metrics console.");
            }}
            className={`p-2 rounded-lg border text-white/50 hover:text-white transition ${
              activeTab === 'settings' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={startListening}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition duration-300 ${
              isListening
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-white/30'}`}></span>
            <span>{isListening ? 'KK LISTENING' : 'VOICE CAPTURE'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <HomePage
            onStartDesigning={() => {
              setActiveTab('cad');
              speak("Loading blueprint board sandbox workspace.");
            }}
            onBookDemo={() => {
              setActiveTab('contact');
              speak("Contact form loaded. Let us coordinate a demonstration.");
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToCAD={() => setActiveTab('cad')}
            onNavigateToThree={() => setActiveTab('three')}
            speak={speak}
          />
        )}

        {activeTab === 'cad' && (
          <CADCanvas2D
            elements={cadElements}
            onUpdateElements={setCadElements}
            onGenerateAIPlan={(prompt) => {
              speak(`Synthesizing procedural layout from instructions: "${prompt}"`);
              setCadElements([
                ...cadElements,
                { id: 'g1', type: 'wall', x1: 180, y1: 120, x2: 520, y2: 120 },
                { id: 'g2', type: 'furniture', x1: 300, y1: 200, x2: 300, y2: 200, name: 'sofa' },
              ]);
            }}
            speak={speak}
          />
        )}

        {activeTab === 'three' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-[500px]">
              <Workspace3D elements={cadElements} speak={speak} />
            </div>
            <div className="space-y-6">
              {kkMode === 'floating' ? (
                <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center h-[520px] justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent-cyan/[0.02] rounded-full blur-2xl"></div>
                  <div>
                    <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest bg-accent-cyan/10 px-2.5 py-1 rounded">Mode 1 • Floating KK</span>
                    <h4 className="text-white font-bold text-sm mt-3">KK 3D Assistant Render</h4>
                  </div>

                  <div className="w-56 h-56">
                    <KKRobotCanvas
                      action={isSpeaking ? 'explain' : isListening ? 'tilt' : 'idle'}
                      expression={isListening ? 'thinking' : 'happy'}
                      speaking={isSpeaking}
                    />
                  </div>

                  <div className="space-y-3 w-full">
                    <p className="text-white/60 text-[10px] leading-relaxed">
                      "Speak to me directly or click the speech toggles to calibrate my automated presentation voice."
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button onClick={suggestLayout} className="py-1.5 bg-white/5 hover:bg-white/10 rounded-lg font-semibold border border-white/5 text-white/80">Suggest Room</button>
                      <button onClick={optimizeLighting} className="py-1.5 bg-white/5 hover:bg-white/10 rounded-lg font-semibold border border-white/5 text-white/80">Solar Audit</button>
                    </div>
                    <button
                      onClick={() => { setKkMode('chat'); speak("Switching operating layout to ChatGPT style conversational Mode 2."); }}
                      className="w-full py-2 bg-accent-cyan text-dark font-extrabold rounded-xl transition hover:bg-accent-cyan/80 text-[11px]"
                    >
                      Switch to Mode 2 (Chat Interface)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <KKChat
                    conversation={chatHistory}
                    onSendMessage={handleSendMessage}
                    isSpeaking={isSpeaking}
                    onVoiceToggle={() => speak("Voice synthesizer configured and responding.")}
                  />
                  <button
                    onClick={() => { setKkMode('floating'); speak("Restoring cute 3D KK floating robot companion frame."); }}
                    className="w-full py-2.5 glass-card hover:border-accent-cyan/40 hover:text-accent-cyan rounded-xl transition text-xs font-semibold text-white/70"
                  >
                    Restore Mode 1 Floating KK Avatar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">AI Architectural Copilot</h3>
              <p className="text-white/45 text-xs">Run safety compliance mistakes audits, optimize thermal lighting, and evaluate LEED metrics</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between h-[520px]">
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-sm">Interactive AI Core Analytics</h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    PlanVista's cognitive AI operates concurrently with your design inputs. Use the controls on the right sidebar to run diagnostic passes, audit layout safety regulations, calculate eco scores, or optimize material costs.
                  </p>

                  {/* Visual CAD Preview or status meter */}
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                      <span>COGNITIVE LOAD INDICATOR</span>
                      <span className="text-accent-cyan animate-pulse">ACTIVE ANALYSIS PASS</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-accent-cyan h-full w-[88%] animate-pulse"></div>
                    </div>
                    <p className="text-[10px] text-white/40 font-mono">88% NEURAL NET PROCESSING CAPACITY AVAILABLE</p>
                  </div>
                </div>

                {/* Nice visual illustration of KK */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20">
                  <span className="text-2xl animate-bounce">🤖</span>
                  <div>
                    <h5 className="text-white text-xs font-bold">Ask me to generate models!</h5>
                    <p className="text-white/60 text-[10px] leading-relaxed">
                      You can use either voice commands or the Mode 2 ChatGPT sidebar to ask me to instantly create villas, rotate buildings, toggle daylight modes, or compile excel spreadsheets.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <AIAssistantSidebar
                  onSuggestLayout={suggestLayout}
                  onOptimizeLighting={optimizeLighting}
                  onReduceCost={handleReduceCost}
                  onImproveSustainability={handleImproveSustainability}
                  speak={speak}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pm' && <ProjectManagement />}

        {activeTab === 'cost' && <CostEstimation elements={cadElements} speak={speak} />}

        {activeTab === 'reports' && <AIReports elements={cadElements} speak={speak} />}

        {activeTab === 'contact' && <ContactPage speak={speak} />}

        {activeTab === 'about' && <AboutPage />}

        {activeTab === 'settings' && (
          <SettingsPage
            onThemeToggle={() => setDarkTheme(!darkTheme)}
            darkTheme={darkTheme}
            speechPitch={speechPitch}
            setSpeechPitch={setSpeechPitch}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            speak={speak}
          />
        )}

        {activeTab === 'investor' && <InvestorMode speak={speak} />}
      </main>

      {/* Guided Tour overlay controller popup */}
      {tourOpen && (
        <GuidedTour
          onStepChange={(page) => {
            setActiveTab(page);
          }}
          speak={speak}
          onClose={() => setTourOpen(false)}
        />
      )}

      {/* Persistent corner KK floating home */}
      {introComplete && activeTab !== 'three' && (
        <div className="fixed bottom-6 right-6 z-[90] w-40 h-40 glass-card rounded-3xl border-white/5 hover:border-accent-cyan/20 p-2 flex flex-col items-center justify-center text-center shadow-xl group">
          <div className="w-24 h-24 relative">
            <KKRobotCanvas
              action={isSpeaking ? 'explain' : isListening ? 'tilt' : 'idle'}
              expression={isListening ? 'thinking' : 'happy'}
              speaking={isSpeaking}
            />
          </div>
          <span className="text-[8px] font-mono text-accent-cyan tracking-wider uppercase animate-pulse">KK Architecture OS</span>
        </div>
      )}
    </div>
  );
};
export default App;
