import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { STORIES } from '../../src/constants/stories';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { playSpeech } from '../../src/utils/sound';

export default function StoriesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📚 Story Corner</Text>
        <View style={{ width: 44 }} />
      </View>

      <Text style={styles.subtitle}>Pick a story to read!</Text>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {STORIES.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
}

function StoryCard({ story }: { story: typeof STORIES[0] }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    playSpeech(story.title);
    setTimeout(() => router.push(`/stories/${story.id}` as any), 150);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[styles.card, { backgroundColor: story.color }, SHADOWS.card]}
      >
        <Text style={styles.cardEmoji}>{story.emoji}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{story.title}</Text>
          <Text style={styles.cardPages}>{story.pages.length} pages</Text>
        </View>
        <Text style={styles.cardArrow}>▶</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    backgroundColor: COLORS.library,
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
  subtitle: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    gap: 14,
  },
  cardEmoji: { fontSize: 48 },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
  cardPages: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  cardArrow: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.8,
  },
});
