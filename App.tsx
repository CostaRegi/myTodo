import React from 'react';
import {HomeScreen} from './src/screens/HomeScreen';
import {SafeAreaView, StyleSheet} from 'react-native';
import {TodoProvider} from './src/context/TodoContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TodoProvider>
        <HomeScreen />
      </TodoProvider>
    </SafeAreaView>
  );
};

export default App;
