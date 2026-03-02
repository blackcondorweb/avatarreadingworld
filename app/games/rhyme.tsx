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
import { RHYME_PAIRS, RhymePair } from '../../src/constants/words';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { playSpeech } from '../../src/utils/sound';
import { addStars } from '../../src/utils/storage';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getRhymeGroup(pairs: RhymePair[]): { prompt: RhymePair; choices: RhymePair[] } {
  const shuffled = shuffle(pairs);
  const prompt = shuffled[0];
  const correctAnswer = shuffled.find(
    (p) => p.rhymeGroup === prompt.rhymeGroup && p.word !== prompt.word
  )!;
  const wrongAnswers = shuffle(
    shuffled.filter((p) => p.rhymeGroup !== prompt.rhymeGroup)
  ).slice(0, 2);
  return { prompt, choices: shuffle([correctAnswer, ...wrongAnswers]) };
}

export default function RhymeTimeScreen() {
  const router = useRouter();
  const [round, setRound] = useState(() => getRhymeGroup(RHYME_PAIRS));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const promptScale = useRef(new Animated.Value(1)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    playSpeech(`What rhymes with... ${round.prompt.word}?`);
    Animated.loop(
      Animated.sequence([
        Animated.timing(promptScale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(promptScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [round]);

  const handleChoice = async (choice: RhymePair) => {
    if (selected) return;
    setSelected(choice.word);
    const correct = choice.rhymeGroup === round.prompt.rhymeGroup;
    setIsCorrect(correct);

    Animated.timing(resultOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    if (correct) {
      playSpeech(`Yes! ${round.prompt.word} and ${choice.word} rhyme!`);
      const newScore = score + 1;
      setScore(newScore);
      await addStars(2);
    } else {
      playSpeech(`Oops! ${choice.word} doesn't rhyme. Try again!`);
    }

    setTimeout(() => {
      resultOpacity.setValue(0);
      setSelected(null);
      setIsCorrect(null);
      setRound(getRhymeGroup(RHYME_PAIRS));
      setQuestionCount((q) => q + 1);
    }, 1800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎵 Rhyme Time!</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      <Text style={styles.instruction}>What rhymes with...</Text>

      {/* Prompt word */}
      <Animated.View style={[styles.promptCard, SHADOWS.card, { transform: [{ scale: promptScale }] }]}>
        <Text style={styles.promptEmoji}>{round.prompt.emoji}</Text>
        <Text style={styles.promptWord}>{round.prompt.word}</Text>
      </Animated.View>

      <Text style={styles.choiceInstruction}>Pick the rhyming word! 👇</Text>

      {/* Choices */}
      <View style={styles.choices}>
        {round.choices.map((choice) => {
          const isSelected = selected === choice.word;
          const correct = choice.rhymeGroup === round.prompt.rhymeGroup;
          return (
            <TouchableOpacity
              key={choice.word}
              onPress={() => handleChoice(choice)}
              disabled={!!selected}
              style={[
                styles.choiceBtn,
                SHADOWS.card,
                isSelected && correct && styles.choiceCorrect,
                isSelected && !correct && styles.choiceWrong,
              ]}
            >
              <Text style={styles.choiceEmoji}>{choice.emoji}</Text>
              <Text style={styles.choiceWord}>{choice.word}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Result feedback */}
      <Animated.View style={[styles.result, { opacity: resultOpacity }]}>
        <Text style={styles.resultText}>
          {isCorrect ? '🎉 Yes! They rhyme!' : '❌ Not quite!'}
        </Text>
      </Animated.View>
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
    backgroundColor: COLORS.games,
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
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginTop: 24,
  },
  promptCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: 48,
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  promptEmoji: { fontSize: 72 },
  promptWord: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    marginTop: 8,
  },
  choiceInstruction: {
    fontFamily: 'Fredoka-Regular',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 20,
    marginBottom: 12,
  },
  choices: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  choiceBtn: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    minWidth: 100,
  },
  choiceCorrect: {
    backgroundColor: '#E8F5E9',
    borderWidth: 3,
    borderColor: COLORS.success,
  },
  choiceWrong: {
    backgroundColor: '#FFEBEE',
    borderWidth: 3,
    borderColor: COLORS.accent1,
  },
  choiceEmoji: { fontSize: 44 },
  choiceWord: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginTop: 6,
  },
  result: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.card,
  },
  resultText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
});
