import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { STORIES } from '../../src/constants/stories';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { playSpeech, stopSpeech } from '../../src/utils/sound';
import { addStars, markActivityCompleted } from '../../src/utils/storage';

const { width } = Dimensions.get('window');

export default function StoryReaderScreen() {
  const { story: storyId } = useLocalSearchParams<{ story: string }>();
  const router = useRouter();
  const story = STORIES.find((s) => s.id === storyId) ?? STORIES[0];

  const [pageIndex, setPageIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<number>(-1);
  const [finished, setFinished] = useState(false);

  const pageScale = useRef(new Animated.Value(0.92)).current;
  const emojiFloat = useRef(new Animated.Value(0)).current;
  const celebScale = useRef(new Animated.Value(0)).current;

  const currentPage = story.pages[pageIndex];
  const words = currentPage.text.split(' ');

  useEffect(() => {
    pageScale.setValue(0.92);
    Animated.spring(pageScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    setHighlightedWord(-1);

    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiFloat, { toValue: -10, duration: 1200, useNativeDriver: true }),
        Animated.timing(emojiFloat, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [pageIndex]);

  const readAloud = async () => {
    setIsReading(true);
    // Highlight word by word
    for (let i = 0; i < words.length; i++) {
      setHighlightedWord(i);
      await new Promise<void>((res) => {
        playSpeech(words[i]);
        setTimeout(res, 650);
      });
    }
    setHighlightedWord(-1);
    setIsReading(false);
  };

  const tapWord = (word: string) => {
    playSpeech(word);
  };

  const handleNext = () => {
    stopSpeech();
    if (pageIndex < story.pages.length - 1) {
      setPageIndex((p) => p + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (pageIndex > 0) setPageIndex((p) => p - 1);
  };

  const handleFinish = async () => {
    setFinished(true);
    await addStars(5);
    await markActivityCompleted(`story_${story.id}`);
    Animated.spring(celebScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    playSpeech('Amazing! You read the whole story! You earned 5 stars!');
  };

  return (
    <View style={[styles.container, { backgroundColor: story.color }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { stopSpeech(); router.back(); }} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.pageNum}>{pageIndex + 1}/{story.pages.length}</Text>
      </View>

      {/* Scene emoji */}
      <Animated.View style={[styles.sceneArea, { transform: [{ translateY: emojiFloat }] }]}>
        <Text style={styles.sceneEmoji}>{currentPage.sceneEmoji}</Text>
      </Animated.View>

      {/* Page card */}
      <Animated.View style={[styles.pageCard, SHADOWS.card, { transform: [{ scale: pageScale }] }]}>
        <View style={styles.wordRow}>
          {words.map((word, i) => (
            <TouchableOpacity key={i} onPress={() => tapWord(word)}>
              <Text
                style={[
                  styles.word,
                  highlightedWord === i && styles.wordHighlighted,
                ]}
              >
                {word}{' '}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={pageIndex === 0}
          style={[styles.arrowBtn, pageIndex === 0 && styles.arrowDisabled]}
        >
          <Text style={styles.arrowText}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={readAloud}
          disabled={isReading}
          style={[styles.readBtn, SHADOWS.button, isReading && styles.readBtnActive]}
        >
          <Text style={styles.readBtnText}>{isReading ? '🔊 Reading...' : '🔊 Read to me!'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>
            {pageIndex < story.pages.length - 1 ? '▶' : '✅'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Page dots */}
      <View style={styles.dots}>
        {story.pages.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === pageIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Finish overlay */}
      {finished && (
        <Animated.View style={[styles.finishOverlay, { transform: [{ scale: celebScale }] }]}>
          <Text style={styles.finishEmoji}>🎉🌟🎉</Text>
          <Text style={styles.finishTitle}>The End!</Text>
          <Text style={styles.finishSub}>You earned 5 ⭐ stars!</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.homeBtn, SHADOWS.button]}>
            <Text style={styles.homeBtnText}>📚 More Stories</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontFamily: 'Fredoka-Bold', fontSize: 24, color: COLORS.white },
  storyTitle: { fontFamily: 'Fredoka-Bold', fontSize: FONT_SIZES.md, color: COLORS.white },
  pageNum: { fontFamily: 'Fredoka-Regular', fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.85)' },
  sceneArea: {
    alignItems: 'center',
    marginVertical: 8,
  },
  sceneEmoji: { fontSize: 80, letterSpacing: 4 },
  pageCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    minHeight: 120,
  },
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  word: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    lineHeight: 44,
    paddingHorizontal: 2,
  },
  wordHighlighted: {
    color: COLORS.primary,
    fontFamily: 'Fredoka-Bold',
    textDecorationLine: 'underline',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  arrowBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: { opacity: 0.3 },
  arrowText: { fontSize: 22, color: COLORS.white },
  readBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  readBtnActive: { backgroundColor: '#F0F0F0' },
  readBtnText: { fontFamily: 'Fredoka-Bold', fontSize: FONT_SIZES.sm, color: COLORS.text },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: COLORS.white,
    width: 20,
    borderRadius: 5,
  },
  finishOverlay: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  finishEmoji: { fontSize: 52, marginBottom: 8 },
  finishTitle: { fontFamily: 'Fredoka-Bold', fontSize: FONT_SIZES.xl, color: COLORS.text },
  finishSub: { fontFamily: 'Fredoka-Regular', fontSize: FONT_SIZES.md, color: COLORS.textLight, marginVertical: 8 },
  homeBtn: {
    marginTop: 12,
    backgroundColor: COLORS.library,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.full,
  },
  homeBtnText: { fontFamily: 'Fredoka-Bold', fontSize: FONT_SIZES.sm, color: COLORS.white },
});
