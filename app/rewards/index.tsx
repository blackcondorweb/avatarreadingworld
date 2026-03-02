import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { getStars, getLettersLearned, getCompletedActivities } from '../../src/utils/storage';
import { playSpeech } from '../../src/utils/sound';

const ACCESSORIES = [
  { id: 'hat_none', label: 'No Hat', emoji: '😊', starsRequired: 0 },
  { id: 'hat_crown', label: 'Crown', emoji: '👑', starsRequired: 5 },
  { id: 'hat_cap', label: 'Cap', emoji: '🧢', starsRequired: 10 },
  { id: 'hat_party', label: 'Party Hat', emoji: '🎉', starsRequired: 20 },
  { id: 'pet_cat', label: 'Cat Friend', emoji: '🐱', starsRequired: 30 },
  { id: 'pet_dog', label: 'Dog Friend', emoji: '🐶', starsRequired: 40 },
  { id: 'pet_bunny', label: 'Bunny Friend', emoji: '🐰', starsRequired: 55 },
  { id: 'wings_fairy', label: 'Fairy Wings', emoji: '🧚', starsRequired: 75 },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [lettersLearned, setLettersLearned] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const starScale = useRef(new Animated.Value(1)).current;
  const jarFill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [s, letters, activities] = await Promise.all([
      getStars(),
      getLettersLearned(),
      getCompletedActivities(),
    ]);
    setStars(s);
    setLettersLearned(letters);
    setCompletedActivities(activities);

    // Animate jar fill
    const fillPercent = Math.min(s / 100, 1);
    Animated.timing(jarFill, { toValue: fillPercent, duration: 1200, useNativeDriver: false }).start();

    // Pulse star icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(starScale, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(starScale, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    playSpeech(`You have ${s} stars! Amazing work!`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⭐ Trophy Room</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Star count */}
        <Animated.View style={[styles.starBadge, SHADOWS.button, { transform: [{ scale: starScale }] }]}>
          <Text style={styles.starEmoji}>⭐</Text>
          <Text style={styles.starCount}>{stars}</Text>
          <Text style={styles.starLabel}>Stars Earned!</Text>
        </Animated.View>

        {/* Progress stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: COLORS.school }]}>
            <Text style={styles.statNum}>{lettersLearned.length}</Text>
            <Text style={styles.statLabel}>Letters{'\n'}Learned</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.library }]}>
            <Text style={styles.statNum}>
              {completedActivities.filter((a) => a.startsWith('story_')).length}
            </Text>
            <Text style={styles.statLabel}>Stories{'\n'}Read</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.puzzle }]}>
            <Text style={styles.statNum}>
              {completedActivities.filter((a) => a.startsWith('word_')).length}
            </Text>
            <Text style={styles.statLabel}>Words{'\n'}Built</Text>
          </View>
        </View>

        {/* Accessories unlock section */}
        <Text style={styles.sectionTitle}>🎁 Unlockable Rewards</Text>
        <View style={styles.accessoriesGrid}>
          {ACCESSORIES.map((acc) => {
            const unlocked = stars >= acc.starsRequired;
            return (
              <View
                key={acc.id}
                style={[styles.accessoryCard, SHADOWS.card, !unlocked && styles.accessoryLocked]}
              >
                <Text style={[styles.accessoryEmoji, !unlocked && styles.emojiLocked]}>
                  {unlocked ? acc.emoji : '🔒'}
                </Text>
                <Text style={[styles.accessoryLabel, !unlocked && styles.labelLocked]}>
                  {acc.label}
                </Text>
                {!unlocked && (
                  <Text style={styles.accessoryCost}>⭐ {acc.starsRequired}</Text>
                )}
                {unlocked && (
                  <Text style={styles.accessoryUnlocked}>✅ Unlocked!</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
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
    backgroundColor: COLORS.trophy,
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  starBadge: {
    backgroundColor: COLORS.starGold,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  starEmoji: { fontSize: 52 },
  starCount: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xxl,
    color: COLORS.white,
  },
  starLabel: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  statNum: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
  },
  statLabel: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  accessoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  accessoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    alignItems: 'center',
    width: '44%',
  },
  accessoryLocked: {
    backgroundColor: '#F5F5F5',
  },
  accessoryEmoji: { fontSize: 44, marginBottom: 6 },
  emojiLocked: { opacity: 0.4 },
  accessoryLabel: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  labelLocked: { color: COLORS.textLight },
  accessoryCost: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  accessoryUnlocked: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 13,
    color: COLORS.success,
    marginTop: 4,
  },
});
