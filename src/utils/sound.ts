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
    const Speech = await import('expo-speech');
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.2,
      rate: 0.85,
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
