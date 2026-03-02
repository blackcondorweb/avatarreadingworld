import { Audio } from 'expo-av';

let soundCache: Record<string, Audio.Sound> = {};

export async function playSound(source: any): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(source);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    // Sound files may not exist yet — silently ignore
    console.warn('Sound play error:', e);
  }
}

export async function playSpeech(text: string): Promise<void> {
  // Uses expo-speech for text-to-speech (no audio files needed)
  try {
    // On web, use the browser SpeechSynthesis directly so we can pick a child/female voice
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.pitch = 1.8;   // high = child-like
      utter.rate = 0.88;
      // Wait for voices to load then pick a child or female-sounding one
      const pickVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
          /Samantha|Zira|Google US English|Karen|Moira|Tessa|Alice|Nicky/i.test(v.name)
        ) || voices.find(v => v.lang === 'en-US') || voices[0];
        if (preferred) utter.voice = preferred;
        window.speechSynthesis.speak(utter);
      };
      if (window.speechSynthesis.getVoices().length > 0) {
        pickVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = pickVoice;
      }
      return;
    }
    // Native (Android/iOS) fallback
    const Speech = await import('expo-speech');
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.75,  // high pitch = sounds younger
      rate: 0.88,
    });
  } catch (e) {
    console.warn('Speech error:', e);
  }
}

export async function stopSpeech(): Promise<void> {
  try {
    const Speech = await import('expo-speech');
    Speech.stop();
  } catch (e) {
    // ignore
  }
}
