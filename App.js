import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppRouter from './src/routes/AppRouter';

export default function App() {
  return (
    <View style={styles.container}>
      <AppRouter />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
