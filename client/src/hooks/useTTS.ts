import { useState, useRef } from 'react';

/**
 * custom hook for text-to-speech functionality, handles reading and stopping speech
 * @returns isSpeaking: boolean, handleStartReading: (text: string) => void, handleStopReading: () => void
 */
const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleStartReading = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    speechRef.current = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speechRef.current);
    setIsSpeaking(true);

    speechRef.current.onend = () => {
      setIsSpeaking(false); // Update state when reading finishes
    };
  };

  const handleStopReading = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stop the ongoing speech
      setIsSpeaking(false);
    }
  };

  return {
    isSpeaking,
    handleStartReading,
    handleStopReading,
  };
};

export default useTextToSpeech;
