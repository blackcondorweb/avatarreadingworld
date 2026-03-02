import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  STARS: 'stars',
  COMPLETED_ACTIVITIES: 'completed_activities',
  UNLOCKED_ACCESSORIES: 'unlocked_accessories',
  AVATAR: 'avatar',
  LETTERS_LEARNED: 'letters_learned',
};

export async function getStars(): Promise<number> {
  const val = await AsyncStorage.getItem(KEYS.STARS);
  return val ? parseInt(val, 10) : 0;
}

export async function addStars(amount: number): Promise<number> {
  const current = await getStars();
  const newTotal = current + amount;
  await AsyncStorage.setItem(KEYS.STARS, String(newTotal));
  return newTotal;
}

export async function getCompletedActivities(): Promise<string[]> {
  const val = await AsyncStorage.getItem(KEYS.COMPLETED_ACTIVITIES);
  return val ? JSON.parse(val) : [];
}

export async function markActivityCompleted(activityId: string): Promise<void> {
  const completed = await getCompletedActivities();
  if (!completed.includes(activityId)) {
    completed.push(activityId);
    await AsyncStorage.setItem(KEYS.COMPLETED_ACTIVITIES, JSON.stringify(completed));
  }
}

export async function getLettersLearned(): Promise<string[]> {
  const val = await AsyncStorage.getItem(KEYS.LETTERS_LEARNED);
  return val ? JSON.parse(val) : [];
}

export async function markLetterLearned(letter: string): Promise<void> {
  const learned = await getLettersLearned();
  if (!learned.includes(letter)) {
    learned.push(letter);
    await AsyncStorage.setItem(KEYS.LETTERS_LEARNED, JSON.stringify(learned));
  }
}

export async function getUnlockedAccessories(): Promise<string[]> {
  const val = await AsyncStorage.getItem(KEYS.UNLOCKED_ACCESSORIES);
  return val ? JSON.parse(val) : ['hat_none'];
}

export async function unlockAccessory(id: string): Promise<void> {
  const unlocked = await getUnlockedAccessories();
  if (!unlocked.includes(id)) {
    unlocked.push(id);
    await AsyncStorage.setItem(KEYS.UNLOCKED_ACCESSORIES, JSON.stringify(unlocked));
  }
}

export async function getAvatar(): Promise<string> {
  const val = await AsyncStorage.getItem(KEYS.AVATAR);
  return val ?? 'girl1';
}

export async function setAvatar(avatar: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.AVATAR, avatar);
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
