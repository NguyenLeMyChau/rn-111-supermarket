import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppRouter from './src/routes/AppRouter';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store/store';

export default function App() {
  return (
    <View style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </Provider>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#FFFFFF',
  },
});
