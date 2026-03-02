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
import { SIGHT_WORDS } from '../../src/constants/words';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { playSpeech } from '../../src/utils/sound';
import { addStars } from '../../src/utils/storage';

const { width } = Dimensions.get('window');

export default function SightWordsScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const scale = useRef(new Animated.Value(0.6)).current;
  const bounce = useRef(new Animated.Value(1)).current;

  const current = SIGHT_WORDS[index % SIGHT_WORDS.length];

  useEffect(() => {
    scale.setValue(0.6);
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    playSpeech(current.word);
  }, [index]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1.05, duration: 700, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleTap = () => {
    playSpeech(current.word);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.15, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const handleNext = async () => {
    await addStars(1);
    setScore((s) => s + 1);
    setIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👁️ Sight Words</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      <Text style={styles.progress}>
        Word {(index % SIGHT_WORDS.length) + 1} of {SIGHT_WORDS.length}
      </Text>

      {/* Flashcard */}
      <TouchableOpacity onPress={handleTap} activeOpacity={0.85} style={styles.cardArea}>
        <Animated.View style={[styles.card, SHADOWS.button, { transform: [{ scale }] }]}>
          <Text style={styles.wordEmoji}>{current.emoji}</Text>
          <Text style={styles.wordText}>{current.word}</Text>
          <Text style={styles.tapHint}>👆 Tap to hear it!</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={index === 0}
          style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
        >
          <Text style={styles.navBtnText}>‹ Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTap} style={[styles.speakBtn, SHADOWS.card]}>
          <Text style={styles.speakBtnText}>🔊 Say it!</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={[styles.navBtn, styles.navBtnNext]}>
          <Text style={styles.navBtnText}>Next ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(((index % SIGHT_WORDS.length) + 1) / SIGHT_WORDS.length) * 100}%` },
          ]}
        />
      </View>
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
    backgroundColor: COLORS.accent4,
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
  progress: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 20,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: width * 0.78,
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  wordEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  wordText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    marginBottom: 16,
  },
  tapHint: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  navBtn: {
    backgroundColor: COLORS.accent4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.full,
  },
  navBtnNext: {
    backgroundColor: COLORS.primary,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
  },
  speakBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  speakBtnText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  progressBar: {
    width: width - 40,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent4,
    borderRadius: 5,
  },
});
