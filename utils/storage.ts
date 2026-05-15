import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData(key: string, value: unknown): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
  }
}

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return null;
  }
}