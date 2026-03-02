import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ALPHABET } from '../../src/constants/alphabet';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { playSpeech } from '../../src/utils/sound';
import { markLetterLearned, addStars } from '../../src/utils/storage';

const { width } = Dimensions.get('window');

export default function LetterScreen() {
  const { letter } = useLocalSearchParams<{ letter: string }>();
  const router = useRouter();
  const data = ALPHABET.find((a) => a.letter === letter) ?? ALPHABET[0];

  const scale = useRef(new Animated.Value(0.5)).current;
  const emojiScale = useRef(new Animated.Value(1)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    // Entrance animation
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    // Auto-speak the letter
    setTimeout(() => playSpeech(`${data.letter}... ${data.letter} is for ${data.word}`), 500);
  }, []);

  const handleTapLetter = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    playSpeech(`${data.letter}! ${data.letter} says... ${data.letter.toLowerCase()}`);
  };

  const handleTapEmoji = () => {
    Animated.sequence([
      Animated.timing(emojiScale, { toValue: 1.4, duration: 100, useNativeDriver: true }),
      Animated.spring(emojiScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    playSpeech(`${data.word}! ${data.word} starts with ${data.letter}`);
  };

  const handleGotIt = async () => {
    await markLetterLearned(data.letter);
    await addStars(1);
    // Celebration animation
    Animated.sequence([
      Animated.timing(starOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(starOpacity, { toValue: 0, duration: 800, delay: 800, useNativeDriver: true }),
    ]).start();
    playSpeech('Amazing! You learned the letter ' + data.letter + '! You earned a star!');
    setCelebrated(true);
    setTimeout(() => router.back(), 2200);
  };

  // Find prev/next letters
  const currentIndex = ALPHABET.findIndex((a) => a.letter === letter);
  const prev = currentIndex > 0 ? ALPHABET[currentIndex - 1] : null;
  const next = currentIndex < ALPHABET.length - 1 ? ALPHABET[currentIndex + 1] : null;

  return (
    <View style={[styles.container, { backgroundColor: data.color }]}>
      {/* Nav */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Text style={styles.navBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.navArrows}>
          {prev && (
            <TouchableOpacity onPress={() => router.replace(`/alphabet/${prev.letter}` as any)} style={styles.navBtn}>
              <Text style={styles.navBtnText}>‹ {prev.letter}</Text>
            </TouchableOpacity>
          )}
          {next && (
            <TouchableOpacity onPress={() => router.replace(`/alphabet/${next.letter}` as any)} style={styles.navBtn}>
              <Text style={styles.navBtnText}>{next.letter} ›</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Big letter */}
      <TouchableOpacity onPress={handleTapLetter} activeOpacity={0.8} style={styles.letterContainer}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={styles.letterCard}>
            <Text style={styles.letterBig}>{data.uppercase}</Text>
            <Text style={styles.letterSmall}>{data.lowercase}</Text>
          </View>
        </Animated.View>
        <Text style={styles.tapHint}>👆 Tap me!</Text>
      </TouchableOpacity>

      {/* Word + Emoji */}
      <TouchableOpacity onPress={handleTapEmoji} activeOpacity={0.8} style={styles.wordContainer}>
        <Animated.Text style={[styles.wordEmoji, { transform: [{ scale: emojiScale }] }]}>
          {data.emoji}
        </Animated.Text>
        <Text style={styles.wordText}>{data.word}</Text>
        <Text style={styles.wordPhonics}>
          <Text style={styles.wordPhonicsHighlight}>{data.uppercase}</Text>
          {data.word.slice(1).toLowerCase()}
        </Text>
      </TouchableOpacity>

      {/* Star celebration overlay */}
      <Animated.View style={[styles.starOverlay, { opacity: starOpacity }]}>
        <Text style={styles.starText}>⭐ Great job! ⭐</Text>
      </Animated.View>

      {/* Got It button */}
      {!celebrated && (
        <TouchableOpacity onPress={handleGotIt} style={[styles.gotItBtn, SHADOWS.button]}>
          <Text style={styles.gotItText}>✅ I know this letter!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  navArrows: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
  },
  navBtnText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
  },
  letterContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  letterCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
    flexDirection: 'row',
    gap: 8,
  },
  letterBig: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 100,
    color: COLORS.text,
    lineHeight: 120,
  },
  letterSmall: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 70,
    color: COLORS.textLight,
    lineHeight: 90,
    marginTop: 20,
  },
  tapHint: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
  },
  wordContainer: {
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.lg,
  },
  wordEmoji: {
    fontSize: 72,
  },
  wordText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    marginTop: 4,
  },
  wordPhonics: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  wordPhonicsHighlight: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    textDecorationLine: 'underline',
  },
  starOverlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.button,
  },
  starText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.lg,
    color: COLORS.accent2,
  },
  gotItBtn: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: COLORS.white,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.full,
  },
  gotItText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
});
