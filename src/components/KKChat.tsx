import React, { useState } from 'react';
import { Send, Volume2, Sparkles, Bot } from 'lucide-react';

interface KKChatProps {
  onSendMessage: (msg: string) => void;
  conversation: { sender: 'user' | 'kk'; text: string; time: string }[];
  isSpeaking: boolean;
  onVoiceToggle: () => void;
}

export const KKChat: React.FC<KKChatProps> = ({
  onSendMessage,
  conversation,
  isSpeaking,
  onVoiceToggle,
}) => {
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="glass-card rounded-2xl border-white/10 overflow-hidden flex flex-col h-[520px] shadow-2xl relative">
      {/* Premium Header */}
      <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center relative">
            <Bot className="w-5 h-5 text-accent-cyan" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0e1017]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-white font-bold text-sm">KK Architecture OS</h4>
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
            </div>
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider">AI Copilot • Mode 2 (ChatGPT)</p>
          </div>
        </div>

        <button
          onClick={onVoiceToggle}
          className={`p-2 rounded-lg border transition duration-300 ${
            isSpeaking
              ? 'bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan glow-border-cyan'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
          }`}
          title="Toggle Voice Synthesis Output"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-accent-cyan text-dark font-semibold rounded-tr-none'
                  : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-dark/60' : 'text-white/30'} font-mono`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask KK: 'Create a villa', 'Day mode', 'Export BOQ'..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold transition duration-300 flex items-center justify-center shadow-lg"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
export default KKChat;
