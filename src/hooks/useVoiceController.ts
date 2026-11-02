import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceController {
  speak: (text: string, onEnd?: () => void) => void;
  speakFemaleVoice: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  isSupported: boolean;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  isSpeaking: boolean;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

export const useVoiceController = (onCommand?: (command: string) => void): VoiceController => {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPitch, setSpeechPitch] = useState(1.05); // Elegant, confident pitch
  const [speechRate, setSpeechRate] = useState(0.98); // Measured luxury commercial cadence
  const [recognition, setRecognition] = useState<any>(null);

  // Store callback in ref to prevent infinite re-rendering loops
  const onCommandRef = useRef(onCommand);
  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (e: any) => {
          console.error('Speech recognition error', e);
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const commandText = event.results[0][0].transcript;
          if (onCommandRef.current && commandText) {
            onCommandRef.current(commandText);
          }
        };

        setRecognition(rec);
      }
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakFemaleVoice = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('Speech synthesis is not supported in this browser.');
        if (onEnd) onEnd();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05; // Elegant feminine pitch
      utterance.rate = 0.96; // Controlled, authoritative, elegant commercial cadence

      const voices = window.speechSynthesis.getVoices();
      // Look for high-fidelity female voices across platforms
      const femaleVoice =
        voices.find(
          (v) =>
            v.name.includes('Google US English') ||
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Victoria') ||
            v.name.includes('Zira') ||
            (v.name.toLowerCase().includes('female') && v.lang.startsWith('en'))
        ) ||
        voices.find((v) => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male')) ||
        voices[0];

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      let callbackCalled = false;
      const triggerEnd = () => {
        if (callbackCalled) return;
        callbackCalled = true;
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        triggerEnd();
      };

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        triggerEnd();
      };

      // Word count fallback scheduler: accounts for silent/headless/automated environments
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const estimatedDuration = Math.max(1600, wordCount * 290);
      const safetyTimer = setTimeout(() => {
        triggerEnd();
      }, estimatedDuration);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('SpeechSynthesis speak exception:', err);
        clearTimeout(safetyTimer);
        triggerEnd();
      }
    },
    []
  );

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      speakFemaleVoice(text, onEnd);
    },
    [speakFemaleVoice]
  );

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (err) {
        console.error('Failed starting speech recognition:', err);
      }
    } else if (!isSupported) {
      console.warn('Voice commands are not supported on this device/browser.');
    }
  }, [recognition, isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  return {
    speak,
    speakFemaleVoice,
    stopSpeaking,
    isSupported,
    isListening,
    startListening,
    stopListening,
    isSpeaking,
    speechPitch,
    setSpeechPitch,
    speechRate,
    setSpeechRate,
  };
};
