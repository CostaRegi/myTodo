import React, {useEffect, useRef, useState} from 'react';

import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {AddTodoScreen} from './AddTodoScreen';
import {TodoItem} from '../components/TodoItem';
import {Todo, useTodoDispatch, useTodoState} from '../context/TodoContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcdcdc',
  },
  titleContainer: {
    width: '100%',
    height: 80,
    alignSelf: 'flex-start',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.2,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  title: {
    fontWeight: '700',
  },
  listContainer: {
    flex: 8,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    height: '100%',
  },

  footer: {
    backgroundColor: '#4E0D3A',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 8,
    height: 70,
    width: 70,
    borderRadius: 35,
  },

  floatingbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#720D5D',
    height: 70,
    width: 70,
    borderRadius: 35,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 8,
    zIndex: 99,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  buttonText: {
    fontSize: 45,
    fontWeight: '600',
    color: 'white',
  },
});

export const HomeScreen = () => {
  const {todos} = useTodoState();
  const dispatch = useTodoDispatch();
  const [addingTodo, setAddingTodo] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(150)).current;
  const tableOpacity = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: addingTodo ? ['0deg', '-45deg'] : ['-45deg', '0deg'],
    extrapolate: 'clamp',
  });

  const animatedStyle = {
    transform: [{rotate: spin}],
  };

  const scale = scaleValue.interpolate({
    inputRange: [0, 3],
    outputRange: [0, 100],
  });

  const opacity = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const animatedStyleFooter = {
    transform: [{scale}],
    opacity,
  };

  useEffect(() => {
    spinValue.setValue(0);
    tableOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(tableOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    const getTodos = () => {
      dispatch({type: 'load-todo'});
    };
    getTodos();
  }, [spinValue, addingTodo, tableOpacity, dispatch, todos]);

  const addTodoClicked = () => {
    if (!addingTodo) {
      Animated.timing(scaleValue, {
        toValue: 3,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
    setAddingTodo(!addingTodo);
  };

  const renderItem = ({item, index}: {item: Todo; index: number}) => {
    translateX.setValue(300 * (index + 1));
    return (
      <TodoItem
        title={item.title}
        description={item.description}
        id={item.id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Just Today</Text>
      </View>
      {!addingTodo ? (
        <Animated.View style={[styles.listContainer, {opacity: tableOpacity}]}>
          <FlatList
            style={styles.list}
            data={todos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id!.toString()}
          />
        </Animated.View>
      ) : (
        <AddTodoScreen />
      )}
      <Animated.View style={[styles.footer, animatedStyleFooter]} />
      <TouchableOpacity onPress={addTodoClicked} style={styles.floatingbtn}>
        <Animated.Text style={[styles.buttonText, animatedStyle]}>
          +
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};
