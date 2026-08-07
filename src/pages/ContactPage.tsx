import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  speak: (text: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ speak }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    speak("Sending demonstration request coordinates to our executive support. We will get in touch with you shortly.");
    alert("Inquiry successfully delivered. PlanVista global support will coordinate with your team within 2 hours.");
    setForm({ name: '', email: '', message: '' });
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, `You: ${userMsg}`]);
    setChatInput('');

    setTimeout(() => {
      speak("Welcome to PlanVista global live assistant. Let me coordinate an enterprise demonstration date with our team.");
      setChatMessages((prev) => [
        ...prev,
        "KK Live: Welcome to PlanVista live help desk! I am ready to guide you or schedule an executive partnership meeting with our core design team. Please leave your email address."
      ]);
    }, 1000);
  };

  return (
    <div className="w-full pb-20 animate-fade-in" id="contact">
      {/* Intro */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="text-accent-cyan font-mono text-xs uppercase tracking-widest bg-accent-cyan/10 px-3 py-1.5 rounded-full border border-accent-cyan/20">
          Partner & Connect
        </span>
        <h2 className="text-4xl font-extrabold text-white mt-5 mb-4 tracking-tight">Initiate a Demonstration</h2>
        <p className="text-white/60 text-sm font-light max-w-xl mx-auto leading-relaxed">
          If you'd like to partner with PlanVista or schedule a demonstration, you can contact our team here.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Coordinates */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h4 className="text-white font-bold text-lg border-b border-white/5 pb-3">Corporate Headquarters</h4>

            <div className="space-y-4 text-xs text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">PlanVista Inc. Global Labs</p>
                  <p>100 Infinite Loop Suite 400, Cupertino, CA 95014</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-cyan shrink-0" />
                <span>executive-partners@planvista.ai</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-cyan shrink-0" />
                <span>+1 (800) 555-VIZTA</span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Standard Operating Hours</p>
                  <p>Mon - Fri: 08:00 - 18:00 EST • Sat: 10:00 - 14:00 EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social media connections */}
          <div className="glass-card rounded-2xl p-6">
            <h4 className="text-white font-bold text-sm mb-4">International Media & Connections</h4>
            <div className="grid grid-cols-5 gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-accent-cyan/20 rounded-xl flex items-center justify-center transition border border-white/5 hover:border-accent-cyan/30 text-white/70 hover:text-accent-cyan">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-accent-cyan/20 rounded-xl flex items-center justify-center transition border border-white/5 hover:border-accent-cyan/30 text-white/70 hover:text-accent-cyan">
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-accent-cyan/20 rounded-xl flex items-center justify-center transition border border-white/5 hover:border-accent-cyan/30 text-white/70 hover:text-accent-cyan">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-accent-cyan/20 rounded-xl flex items-center justify-center transition border border-white/5 hover:border-accent-cyan/30 text-white/70 hover:text-accent-cyan">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.5 20.5 12 20.5 12 20.5s7.5 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <button onClick={() => setChatOpen(!chatOpen)} className="p-3 bg-white/5 hover:bg-accent-cyan/20 rounded-xl flex items-center justify-center transition border border-white/5 hover:border-accent-cyan/30 text-white/70 hover:text-accent-cyan">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Map Simulation */}
          <div className="glass-card rounded-2xl p-6 relative h-48 border border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-[#0d0f19] opacity-40"></div>
            {/* Minimal SVG coordinate map design */}
            <svg className="absolute inset-0 w-full h-full text-accent-cyan/10" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="90" r="80" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" fill="none" />
              <circle cx="200" cy="90" r="140" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="1" fill="none" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255, 255, 255, 0.05)" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(255, 255, 255, 0.05)" />
              {/* Highlight Pin */}
              <circle cx="200" cy="90" r="6" fill="#00f0ff" className="animate-pulse" />
            </svg>
            <div className="absolute bottom-4 left-4 bg-dark/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-mono text-white/70">
              SIMULATED VECTOR GLOBAL GEOLOCATION LAB
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h4 className="text-white font-bold text-lg mb-4">Enterprise Inquiry Form</h4>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Johnathan Miller"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-accent-cyan/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase mb-1.5">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. jmiller@aerospace.corp"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-accent-cyan/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/40 uppercase mb-1.5">Project Scope Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share a brief of your developmental blueprint needs or investor interest areas..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-accent-cyan/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold text-xs transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/15"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Partnership Proposal</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating 24/7 Live chat window simulation */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-[999] w-80 glass-card rounded-2xl border-accent-cyan/30 shadow-2xl overflow-hidden animate-fade-in flex flex-col h-96 bg-dark/95">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-white font-bold text-xs">PlanVista Live Help Desk</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white font-mono text-xs">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs no-scrollbar flex flex-col">
            {chatMessages.length === 0 ? (
              <p className="text-white/40 text-center py-12">Ask any question to initiate conversation.</p>
            ) : (
              chatMessages.map((m, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg max-w-[85%] ${m.startsWith('You:') ? 'bg-accent-cyan/10 text-accent-cyan self-end ml-auto' : 'bg-white/5 text-white/80'}`}>
                  {m}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleChatSend} className="p-3 bg-white/5 border-t border-white/10 flex gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            />
            <button type="submit" className="px-3 bg-accent-cyan text-dark font-bold rounded-lg text-xs">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default ContactPage;
