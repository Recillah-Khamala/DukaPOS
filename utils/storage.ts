export async function saveData(key: string, value: unknown): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    // Use localStorage on web, AsyncStorage on native
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, jsonValue);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
  }
}

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    let jsonValue: string | null;
    if (typeof window !== 'undefined' && window.localStorage) {
      jsonValue = window.localStorage.getItem(key);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      jsonValue = await AsyncStorage.getItem(key);
    }
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return null;
  }
}