import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { playSpeech } from '../src/utils/sound';

const { width } = Dimensions.get('window');
const CARD_W = Math.min((width - 72) / 2, 200);

// ─── Toca Boca colour palette ────────────────────────────────────────────────
const T = {
  sky1: '#7DD8F8',
  sky2: '#B8EDFF',
  ground: '#6EC96E',
  groundDark: '#52A852',
  sun: '#FFE14D',
  sunRim: '#FFB800',
  cloud: '#FFFFFF',
  outline: '#2D2D2D',
  white: '#FFFFFF',
  alphabet:   { wall: '#FF6FB0', roof: '#E0005E', door: '#A0003C', win: '#FFF9C4' },
  words:      { wall: '#FFCE47', roof: '#FF9900', door: '#C06000', win: '#C8F0FF' },
  sightwords: { wall: '#A78BFA', roof: '#6D28D9', door: '#3B0764', win: '#FEF9C3' },
  stories:    { wall: '#FD8C5A', roof: '#C0440B', door: '#7C2A00', win: '#D0F4DE' },
  games:      { wall: '#4DDFC4', roof: '#0E9272', door: '#065244', win: '#FFF4B3' },
  rewards:    { wall: '#FDE68A', roof: '#F59E0B', door: '#92400E', win: '#E0F2FE' },
} as const;

type LocId = 'alphabet' | 'words' | 'sightwords' | 'stories' | 'games' | 'rewards';

type Location = {
  id: LocId;
  label: string;
  emoji: string;
  route: string;
  desc: string;
  char: string;
};

const LOCATIONS: Location[] = [
  { id: 'alphabet',   label: 'Alphabet World', emoji: '🔤', route: '/alphabet',        desc: 'Learn A–Z!',     char: '🧒' },
  { id: 'words',      label: 'Word Builders',  emoji: '🧩', route: '/words/builder',   desc: 'Build words!',   char: '👧' },
  { id: 'sightwords', label: 'Sight Words',    emoji: '👁️', route: '/words/sightwords', desc: 'Tricky words!', char: '🦸‍♀️' },
  { id: 'stories',    label: 'Story Corner',   emoji: '📚', route: '/stories',          desc: 'Read stories!', char: '🧚' },
  { id: 'games',      label: 'Game Zone',      emoji: '🎮', route: '/games/rhyme',      desc: 'Play games!',   char: '🐸' },
  { id: 'rewards',    label: 'Trophy Room',    emoji: '⭐', route: '/rewards',           desc: 'Your stars!',   char: '🦄' },
];

// ─── Animated cloud ───────────────────────────────────────────────────────────
function Cloud({ top, initialX, size = 1 }: { top: number; initialX: number; size?: number }) {
  const x = useRef(new Animated.Value(initialX)).current;
  useEffect(() => {
    const drift = () => {
      Animated.sequence([
        Animated.timing(x, { toValue: initialX + 18, duration: 3000 + Math.random() * 1500, useNativeDriver: true }),
        Animated.timing(x, { toValue: initialX,      duration: 3000 + Math.random() * 1500, useNativeDriver: true }),
      ]).start(() => drift());
    };
    drift();
  }, []);
  const w = 80 * size, h = 38 * size, r = 22 * size;
  const p = 48 * size, p2 = 38 * size;
  return (
    <Animated.View style={[styles.cloud, { top, transform: [{ translateX: x }] }]}>
      <View style={[styles.cloudBody, { width: w, height: h, borderRadius: r }]} />
      <View style={[styles.cloudPuff, { width: p,  height: p,  bottom: 10 * size, left: 10 * size }]} />
      <View style={[styles.cloudPuff, { width: p2, height: p2, bottom: 14 * size, left: 34 * size }]} />
    </Animated.View>
  );
}

// ─── Animated sun ─────────────────────────────────────────────────────────────
function Sun() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.07, duration: 1800, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1,    duration: 1800, useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <Animated.View style={[styles.sunWrap, { transform: [{ scale: pulse }] }]}>
      {[0,45,90,135,180,225,270,315].map(deg => (
        <View key={deg} style={[styles.sunRay, { transform: [{ rotate: `${deg}deg` }] }]} />
      ))}
      <View style={styles.sun}>
        <Text style={styles.sunFace}>😊</Text>
      </View>
    </Animated.View>
  );
}

// ─── Rainbow ─────────────────────────────────────────────────────────────────
const RAINBOW_COLORS = ['#FF4B4B','#FF8C00','#FFD700','#4CAF50','#2196F3','#9C27B0'];
function Rainbow() {
  return (
    <View style={styles.rainbowWrap} pointerEvents="none">
      {RAINBOW_COLORS.map((c, i) => (
        <View key={i} style={[styles.rainbowArc, {
          width:  220 - i * 22,
          height: 110 - i * 11,
          borderRadius: (220 - i * 22) / 2,
          borderColor: c,
          borderWidth: 7,
          bottom: i * 7,
        }]} />
      ))}
    </View>
  );
}

// ─── Decorative tree ──────────────────────────────────────────────────────────
function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <View style={[styles.treeWrap, { left: x }]}>
      <View style={[styles.treetop1, { width: 38*s, height: 38*s, borderRadius: 20*s }]} />
      <View style={[styles.treetop2, { width: 28*s, height: 28*s, borderRadius: 15*s, top: -50*s, left: 5*s }]} />
      <View style={[styles.trunk,    { width: 10*s, height: 20*s, borderRadius: 4*s  }]} />
    </View>
  );
}

// ─── Building card ────────────────────────────────────────────────────────────
function BuildingCard({ loc, index }: { loc: Location; index: number }) {
  const router = useRouter();
  const bounce = useRef(new Animated.Value(0)).current;
  const scale  = useRef(new Animated.Value(1)).current;
  const clr = T[loc.id];

  useEffect(() => {
    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(bounce, { toValue: -6, duration: 1100 + index * 120, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0,  duration: 1100 + index * 120, useNativeDriver: true }),
      ])).start();
    }, index * 200);
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scale,  { toValue: 1,                  useNativeDriver: true }),
    ]).start();
    playSpeech(loc.label);
    setTimeout(() => router.push(loc.route as any), 220);
  };

  return (
    <Animated.View style={{ transform: [{ translateY: bounce }, { scale }] }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={[styles.building, { width: CARD_W }]}>
        {/* Roof */}
        <View style={[styles.roofWrap, { width: CARD_W }]}>
          <View style={[styles.roofOutline, {
            borderLeftWidth: CARD_W / 2 + 3,
            borderRightWidth: CARD_W / 2 + 3,
            borderBottomWidth: 47,
          }]} />
          <View style={[styles.roof, {
            borderLeftWidth: CARD_W / 2,
            borderRightWidth: CARD_W / 2,
            borderBottomWidth: 44,
            borderBottomColor: clr.roof,
          }]} />
        </View>
        {/* Walls */}
        <View style={[styles.walls, { backgroundColor: clr.wall, width: CARD_W }]}>
          <View style={styles.windowRow}>
            <View style={[styles.window, { backgroundColor: clr.win }]}>
              <Text style={styles.windowChar}>{loc.char}</Text>
            </View>
            <View style={[styles.window, { backgroundColor: clr.win }]}>
              <Text style={styles.windowChar}>✨</Text>
            </View>
          </View>
          <View style={[styles.door, { backgroundColor: clr.door }]}>
            <Text style={styles.doorEmoji}>{loc.emoji}</Text>
          </View>
          <Text style={styles.buildingLabel}>{loc.label}</Text>
          <Text style={styles.buildingDesc}>{loc.desc}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Home screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const titleY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(titleY, { toValue: -8, duration: 950, useNativeDriver: true }),
      Animated.timing(titleY, { toValue:  0, duration: 950, useNativeDriver: true }),
    ])).start();
    playSpeech('Welcome to Avatar Reading World! Tap a building to start!');
  }, []);

  return (
    <View style={styles.screen}>
      {/* Sky */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: T.sky1 }]} />
      <View style={[styles.skyBottom, { backgroundColor: T.sky2 }]} />

      {/* Sun */}
      <Sun />

      {/* Rainbow */}
      <Rainbow />

      {/* Clouds */}
      <Cloud top={30}  initialX={20}          size={1}    />
      <Cloud top={70}  initialX={180}          size={0.75} />
      <Cloud top={115} initialX={width - 160}  size={0.9}  />

      {/* Ground */}
      <View style={styles.ground} />
      <View style={styles.grassBumps}>
        {Array.from({ length: 11 }).map((_, i) => (
          <View key={i} style={[styles.grassBump, { left: i * (width / 10) - 10 }]} />
        ))}
      </View>

      {/* Trees */}
      <Tree x={6}           s={0.9} />
      <Tree x={width - 55}  s={1}   />
      <Tree x={width/2-130} s={0.75} />
      <Tree x={width/2+90}  s={0.8}  />

      {/* Flowers */}
      {['🌸','🌼','🌺','🌻','🌷','🌼'].map((f, i) => (
        <Text key={i} style={[styles.flower, { left: 12 + i * (width / 6 - 4) }]}>{f}</Text>
      ))}

      {/* Characters standing on ground */}
      <Text style={[styles.groundChar, { left: width * 0.15 }]}>🧒</Text>
      <Text style={[styles.groundChar, { left: width * 0.5 }]}>👧</Text>
      <Text style={[styles.groundChar, { right: 20 }]}>🐱</Text>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title sign */}
        <Animated.View style={[styles.titleSign, { transform: [{ translateY: titleY }] }]}>
          <Text style={styles.titleEmoji}>🌟</Text>
          <Text style={styles.title}>Avatar Reading World</Text>
          <Text style={styles.subtitle}>Tap a building to explore!</Text>
        </Animated.View>

        {/* Buildings */}
        <View style={styles.grid}>
          {LOCATIONS.map((loc, i) => (
            <BuildingCard key={loc.id} loc={loc} index={i} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },

  skyBottom: {
    position: 'absolute',
    top: '50%', left: 0, right: 0, height: '30%',
  },

  // Sun
  sunWrap: {
    position: 'absolute', top: 28, right: 28,
    width: 72, height: 72,
    alignItems: 'center', justifyContent: 'center',
  },
  sun: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: T.sun,
    borderWidth: 3, borderColor: T.sunRim,
    alignItems: 'center', justifyContent: 'center',
  },
  sunFace: { fontSize: 30 },
  sunRay: {
    position: 'absolute',
    width: 4, height: 16,
    backgroundColor: T.sunRim,
    borderRadius: 2,
    top: -2, left: 34,
  },

  // Clouds
  cloud: { position: 'absolute' },
  cloudBody: {
    position: 'absolute', bottom: 0, left: 0,
    backgroundColor: T.cloud,
    borderWidth: 2, borderColor: 'rgba(0,0,0,0.06)',
  },
  cloudPuff: {
    position: 'absolute',
    backgroundColor: T.cloud,
    borderRadius: 999,
    borderWidth: 2, borderColor: 'rgba(0,0,0,0.06)',
  },

  // Rainbow
  rainbowWrap: {
    position: 'absolute', top: 20, left: 30,
    width: 220, height: 120,
    alignItems: 'center', justifyContent: 'flex-end',
  },
  rainbowArc: {
    position: 'absolute',
    borderTopWidth: 7,
    borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },

  // Ground
  ground: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    backgroundColor: T.ground,
    borderTopLeftRadius: 60, borderTopRightRadius: 60,
  },
  grassBumps: { position: 'absolute', bottom: 70, left: 0, right: 0, height: 28 },
  grassBump: {
    position: 'absolute',
    width: 44, height: 28,
    backgroundColor: T.groundDark, borderRadius: 22,
  },

  // Trees
  treeWrap: { position: 'absolute', bottom: 56, alignItems: 'center' },
  treetop1: { backgroundColor: '#3CB043', borderWidth: 2, borderColor: T.outline },
  treetop2: { position: 'absolute', backgroundColor: '#4DC44A', borderWidth: 2, borderColor: T.outline },
  trunk:    { backgroundColor: '#8B5E3C', borderWidth: 2, borderColor: T.outline },

  // Flowers & chars
  flower:     { position: 'absolute', bottom: 8, fontSize: 18 },
  groundChar: { position: 'absolute', bottom: 56, fontSize: 30 },

  // Scroll
  scroll: {
    paddingTop: 155,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 20,
  },

  // Title sign
  titleSign: {
    backgroundColor: '#FFF0C8',
    borderWidth: 4, borderColor: T.outline,
    borderRadius: 20,
    paddingHorizontal: 28, paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 0,
    elevation: 6,
  },
  titleEmoji: { fontSize: 36, marginBottom: 2 },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28, color: '#C0440B',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 16, color: '#6B3A00',
    textAlign: 'center', marginTop: 2,
  },

  // Grid
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 16,
    width: '100%',
  },

  // Building
  building: { alignItems: 'center' },
  roofWrap: { height: 50, alignItems: 'center', justifyContent: 'flex-end', overflow: 'visible' },
  roofOutline: {
    position: 'absolute', bottom: -2,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderBottomColor: T.outline,
    width: 0, height: 0,
  },
  roof: {
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    width: 0, height: 0,
  },
  walls: {
    borderWidth: 3, borderColor: T.outline,
    borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
    paddingBottom: 10, paddingHorizontal: 10, paddingTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 0,
    elevation: 5,
  },
  windowRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  window: {
    width: 38, height: 38, borderRadius: 8,
    borderWidth: 3, borderColor: T.outline,
    alignItems: 'center', justifyContent: 'center',
  },
  windowChar: { fontSize: 20 },
  door: {
    width: 42, height: 50,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    borderWidth: 3, borderColor: T.outline,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  doorEmoji: { fontSize: 24 },
  buildingLabel: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 13, color: T.outline, textAlign: 'center',
  },
  buildingDesc: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 11, color: '#444', textAlign: 'center', marginTop: 1,
  },
});
