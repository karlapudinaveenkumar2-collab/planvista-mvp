import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceController {
  speak: (text: string, onEnd?: () => void) => void;
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
  const [speechPitch, setSpeechPitch] = useState(1.1); // Slightly futuristic & friendly pitch
  const [speechRate, setSpeechRate] = useState(1.0);
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
          console.error("Speech recognition error", e);
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
  }, []); // Run exactly once on mount, immune to callback mutations

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('Speech synthesis is not supported in this browser.');
        if (onEnd) onEnd();
        return;
      }

      // Stop any current speaking
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = speechPitch;
      utterance.rate = speechRate;

      // Select a nice premium English voice if available
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find(
        (v) =>
          v.name.includes('Google US English') ||
          v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel')
      );
      if (premiumVoice) {
        utterance.voice = premiumVoice;
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

      // Safety timeout: calculate approximate duration (minimum 1.5s, 280ms per word)
      const estimatedDuration = Math.max(1500, text.split(' ').length * 280);
      const safetyTimer = setTimeout(() => {
        triggerEnd();
      }, estimatedDuration);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("SpeechSynthesis speak exception:", err);
        clearTimeout(safetyTimer);
        triggerEnd();
      }
    },
    [speechPitch, speechRate]
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
