import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ALPHABET } from '../../src/constants/alphabet';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { playSpeech } from '../../src/utils/sound';
import { getLettersLearned } from '../../src/utils/storage';

const { width } = Dimensions.get('window');
const TILE_SIZE = (width - 56) / 4;

function LetterTile({ item, learned }: { item: typeof ALPHABET[0]; learned: boolean }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const wiggle = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.timing(wiggle, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
    playSpeech(item.letter);
    setTimeout(() => router.push(`/alphabet/${item.letter}` as any), 100);
  };

  return (
    <Animated.View style={{ transform: [{ scale }, { rotate: wiggle.interpolate({ inputRange: [-8, 8], outputRange: ['-8deg', '8deg'] }) }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          styles.tile,
          { backgroundColor: item.color },
          learned && styles.tilelearned,
          SHADOWS.card,
        ]}
      >
        {learned && <Text style={styles.checkmark}>✓</Text>}
        <Text style={styles.tileLetter}>{item.letter}</Text>
        <Text style={styles.tileEmoji}>{item.emoji}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AlphabetScreen() {
  const router = useRouter();
  const [learned, setLearned] = useState<string[]>([]);

  useEffect(() => {
    getLettersLearned().then(setLearned);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔤 Alphabet World</Text>
        <View style={{ width: 48 }} />
      </View>
      <Text style={styles.subtitle}>Tap a letter to learn it!</Text>
      <FlatList
        data={ALPHABET}
        numColumns={4}
        keyExtractor={(item) => item.letter}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <LetterTile item={item} learned={learned.includes(item.letter)} />
        )}
      />
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
    paddingBottom: 12,
    backgroundColor: COLORS.school,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: COLORS.white,
    fontFamily: 'Fredoka-Bold',
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
  },
  subtitle: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginVertical: 12,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 10,
  },
  row: {
    gap: 10,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilelearned: {
    opacity: 0.75,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 14,
    color: COLORS.white,
    fontFamily: 'Fredoka-Bold',
  },
  tileLetter: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    lineHeight: FONT_SIZES.xl + 4,
  },
  tileEmoji: {
    fontSize: 20,
  },
});
