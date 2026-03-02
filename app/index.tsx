import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { playSpeech } from '../src/utils/sound';

const { width } = Dimensions.get('window');

type WorldLocation = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  route: string;
  description: string;
};

const LOCATIONS: WorldLocation[] = [
  {
    id: 'alphabet',
    label: 'Alphabet World',
    emoji: '🔤',
    color: COLORS.school,
    route: '/alphabet',
    description: 'Learn all 26 letters!',
  },
  {
    id: 'words',
    label: 'Word Builders',
    emoji: '🧩',
    color: COLORS.puzzle,
    route: '/words/builder',
    description: 'Build fun words!',
  },
  {
    id: 'sightwords',
    label: 'Sight Words',
    emoji: '👁️',
    color: COLORS.accent4,
    route: '/words/sightwords',
    description: 'Learn tricky words!',
  },
  {
    id: 'stories',
    label: 'Story Corner',
    emoji: '📚',
    color: COLORS.library,
    route: '/stories',
    description: 'Read fun stories!',
  },
  {
    id: 'games',
    label: 'Game Zone',
    emoji: '🎮',
    color: COLORS.games,
    route: '/games/rhyme',
    description: 'Play word games!',
  },
  {
    id: 'rewards',
    label: 'Trophy Room',
    emoji: '⭐',
    color: COLORS.trophy,
    route: '/rewards',
    description: 'See your stars!',
  },
];

function LocationCard({ loc, index }: { loc: WorldLocation; index: number }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 1000 + index * 150, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 1000 + index * 150, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    playSpeech(loc.label);
    setTimeout(() => router.push(loc.route as any), 200);
  };

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: bounce }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[styles.card, { backgroundColor: loc.color }, SHADOWS.button]}
      >
        <Text style={styles.cardEmoji}>{loc.emoji}</Text>
        <Text style={styles.cardLabel}>{loc.label}</Text>
        <Text style={styles.cardDesc}>{loc.description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const titleBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleBounce, { toValue: -10, duration: 900, useNativeDriver: true }),
        Animated.timing(titleBounce, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    playSpeech('Welcome! Where do you want to go today?');
  }, []);

  return (
    <View style={styles.container}>
      {/* Sky background */}
      <View style={styles.skyBand} />
      <View style={styles.groundBand} />

      {/* Decorative clouds */}
      <Text style={[styles.cloud, { top: 40, left: 20 }]}>☁️</Text>
      <Text style={[styles.cloud, { top: 60, right: 40 }]}>☁️</Text>
      <Text style={[styles.cloud, { top: 100, left: 120 }]}>☁️</Text>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Animated.View style={{ transform: [{ translateY: titleBounce }] }}>
          <Text style={styles.title}>🌟 Ready to Read! 🌟</Text>
          <Text style={styles.subtitle}>Where do you want to go?</Text>
        </Animated.View>

        {/* World Map Grid */}
        <View style={styles.grid}>
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.id} loc={loc} index={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  skyBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: '#87CEEB',
  },
  groundBand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: '#90EE90',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  cloud: {
    position: 'absolute',
    fontSize: 40,
  },
  scroll: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 28,
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  card: {
    width: (width - 60) / 2,
    aspectRatio: 0.9,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cardEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  cardLabel: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardDesc: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 13,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.9,
  },
});
