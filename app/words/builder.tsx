import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CVC_WORDS, CVCWord } from '../../src/constants/words';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { playSpeech } from '../../src/utils/sound';
import { addStars, markActivityCompleted } from '../../src/utils/storage';

const { width } = Dimensions.get('window');

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function WordBuilderScreen() {
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);
  const [placed, setPlaced] = useState<(string | null)[]>([null, null, null]);
  const [available, setAvailable] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const celebScale = useRef(new Animated.Value(0)).current;
  const emojiShake = useRef(new Animated.Value(0)).current;

  const current: CVCWord = CVC_WORDS[wordIndex % CVC_WORDS.length];

  useEffect(() => {
    resetWord();
    setSuccess(false);
  }, [wordIndex]);

  const resetWord = () => {
    const extras = shuffle(
      CVC_WORDS.flatMap((w) => w.letters).filter((l) => !current.letters.includes(l))
    ).slice(0, 3);
    setAvailable(shuffle([...current.letters, ...extras]));
    setPlaced([null, null, null]);
  };

  const placeLetterAt = (letter: string, slot: number) => {
    if (placed[slot] !== null) return;
    const newPlaced = [...placed];
    newPlaced[slot] = letter;
    setPlaced(newPlaced);
    setAvailable((prev) => {
      const idx = prev.indexOf(letter);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
    playSpeech(letter);
    // Check if complete
    const newWord = newPlaced.map((l, i) => l ?? '').join('');
    if (!newPlaced.includes(null)) {
      if (newWord === current.word) {
        handleSuccess();
      } else {
        // Wrong — wiggle and reset
        Animated.sequence([
          Animated.timing(emojiShake, { toValue: 12, duration: 60, useNativeDriver: true }),
          Animated.timing(emojiShake, { toValue: -12, duration: 60, useNativeDriver: true }),
          Animated.timing(emojiShake, { toValue: 8, duration: 60, useNativeDriver: true }),
          Animated.timing(emojiShake, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
        playSpeech('Oops! Try again!');
        setTimeout(resetWord, 900);
      }
    }
  };

  const removeFromSlot = (slot: number) => {
    if (!placed[slot]) return;
    setAvailable((prev) => [placed[slot]!, ...prev]);
    const newPlaced = [...placed];
    newPlaced[slot] = null;
    setPlaced(newPlaced);
  };

  const handleSuccess = async () => {
    setSuccess(true);
    Animated.spring(celebScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    playSpeech(`${current.word}! Wonderful! You built the word ${current.word}!`);
    const newScore = score + 1;
    setScore(newScore);
    await addStars(2);
    await markActivityCompleted(`word_${current.word}`);
  };

  const handleNext = () => {
    celebScale.setValue(0);
    setSuccess(false);
    setWordIndex((i) => i + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🧩 Word Builder</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      <Text style={styles.instruction}>Tap the letters to build the word!</Text>

      {/* Emoji + Word hint */}
      <Animated.View style={[styles.emojiArea, { transform: [{ rotate: emojiShake.interpolate({ inputRange: [-12, 12], outputRange: ['-12deg', '12deg'] }) }] }]}>
        <Text style={styles.wordEmoji}>{current.emoji}</Text>
      </Animated.View>

      {/* Slots */}
      <View style={styles.slots}>
        {placed.map((letter, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.slot, letter && styles.slotFilled, success && styles.slotSuccess]}
            onPress={() => removeFromSlot(i)}
            disabled={success}
          >
            <Text style={styles.slotLetter}>{letter ?? '_'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Available letters */}
      <View style={styles.letterBank}>
        {available.map((letter, i) => (
          <TouchableOpacity
            key={`${letter}-${i}`}
            style={[styles.letterBtn, SHADOWS.card]}
            onPress={() => {
              // Place in first empty slot
              const firstEmpty = placed.findIndex((p) => p === null);
              if (firstEmpty !== -1) placeLetterAt(letter, firstEmpty);
            }}
            disabled={success}
          >
            <Text style={styles.letterBtnText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={resetWord} style={styles.resetBtn}>
        <Text style={styles.resetText}>🔄 Start over</Text>
      </TouchableOpacity>

      {/* Success overlay */}
      {success && (
        <Animated.View style={[styles.successOverlay, { transform: [{ scale: celebScale }] }]}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successWord}>{current.word.toUpperCase()}!</Text>
          <Text style={styles.successEmoji}>{current.emoji}</Text>
          <TouchableOpacity onPress={handleNext} style={[styles.nextBtn, SHADOWS.button]}>
            <Text style={styles.nextText}>Next Word ➡️</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    backgroundColor: COLORS.puzzle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontFamily: 'Fredoka-Bold', fontSize: 24, color: COLORS.white },
  title: { fontFamily: 'Fredoka-Bold', fontSize: FONT_SIZES.lg, color: COLORS.white },
  scoreBox: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  scoreText: { fontFamily: 'Fredoka-Bold', fontSize: FONT_SIZES.sm, color: COLORS.white },
  instruction: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 18,
    marginBottom: 4,
  },
  emojiArea: {
    marginVertical: 8,
  },
  wordEmoji: { fontSize: 90 },
  slots: {
    flexDirection: 'row',
    gap: 14,
    marginVertical: 16,
  },
  slot: {
    width: 72,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 3,
    borderColor: COLORS.accent4,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  slotFilled: {
    borderStyle: 'solid',
    borderColor: COLORS.puzzle,
    backgroundColor: '#EEF0FF',
  },
  slotSuccess: {
    borderColor: COLORS.success,
    backgroundColor: '#E8F5E9',
  },
  slotLetter: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  letterBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  letterBtn: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.puzzle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterBtnText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
  },
  resetBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.accent4,
  },
  resetText: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
  },
  successOverlay: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: 28,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  successEmoji: { fontSize: 60 },
  successWord: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xxl,
    color: COLORS.success,
    marginVertical: 8,
  },
  nextBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
  },
  nextText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
});
