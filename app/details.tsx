import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.body}>This screen exists to show stack navigation.</Text>
      <Link href="/" style={styles.link}>
        Back to home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  body: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  link: {
    fontSize: 17,
    color: '#2563eb',
    fontWeight: '500',
  },
});
