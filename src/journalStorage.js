import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveJournalEntry(date, entry) {
  await AsyncStorage.setItem(date, JSON.stringify(entry));
}

export async function getJournalEntry(date) {
  const data = await AsyncStorage.getItem(date);
  return data ? JSON.parse(data) : null;
}
