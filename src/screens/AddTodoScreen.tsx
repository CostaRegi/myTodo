import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Todo, useTodoDispatch} from '../context/TodoContext';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },

  btnText: {
    color: '#fff',
    fontSize: 24,
  },

  titleView: {
    alignItems: 'center',
    marginVertical: 50,
    width: 0.75 * width,
  },

  title: {
    color: 'white',
    fontSize: 22,
    marginBottom: 30,
    fontWeight: '800',
  },
  description: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '300',
  },

  inputBox: {
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    width: 0.75 * width,
    height: 0.35 * height,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },

  textInput: {
    marginTop: 10,
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  addButton: {
    padding: 10,
    backgroundColor: '#E30425',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  btnContainer: {flex: 1, alignItems: 'flex-end', flexDirection: 'row'},
  notification: {
    position: 'absolute',
    paddingHorizontal: 7,
    paddingVertical: 15,
    left: 0,
    top: 0,
    right: 0,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#05F4B7',
  },
});
const AnimedAddButton = Animated.createAnimatedComponent(RectButton);

export const AddTodoScreen = () => {
  const scale = useRef(new Animated.Value(0)).current;
  const notificationOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0.5)).current;

  const [todo, setTodo] = useState<Todo>({title: '', description: ''});
  const dispatch = useTodoDispatch();

  const onSubmit = () => {
    dispatch({type: 'add-todo', todo});
    notificationOpacity.setValue(0);
    setTodo({title: '', description: ''});
    Animated.stagger(1000, [
      Animated.timing(notificationOpacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(notificationOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const opacity = notificationOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    scale.setValue(0);
    Animated.timing(scale, {
      toValue: 1,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  useEffect(() => {
    const activeButton = (yes: boolean) => {
      Animated.timing(buttonOpacity, {
        toValue: yes ? 1 : 0.5,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      }).start();
    };
    const {description, title} = todo;
    const yes = description.length > 0 && title.length > 0;
    activeButton(yes);
  }, [todo, buttonOpacity]);

  return (
    <View style={[styles.container]}>
      <Animated.View style={[styles.notification, {opacity}]}>
        <Text style={styles.notificationText}>Todo Added</Text>
      </Animated.View>
      <View style={styles.titleView}>
        <Text style={styles.title}>Add The plan</Text>
        <Text style={styles.description}>
          Organize your day so you don't lose track of what it is important
        </Text>
      </View>

      <Animated.View style={[styles.inputBox, {transform: [{scale}]}]}>
        <View>
          <TextInput
            style={styles.textInput}
            placeholder="Title"
            value={todo.title}
            onChangeText={(text) =>
              setTodo({
                ...todo,
                title: text,
              })
            }
          />
          <TextInput
            style={styles.textInput}
            value={todo.description}
            placeholder="Specific Content"
            onChangeText={(text) =>
              setTodo({
                ...todo,
                description: text,
              })
            }
          />
          <View style={styles.btnContainer}>
            <AnimedAddButton
              style={[styles.addButton, {opacity: buttonOpacity}]}
              onPress={onSubmit}
              enabled={todo.description.length > 0 && todo.title.length > 0}>
              <Text style={styles.btnText}>Add</Text>
            </AnimedAddButton>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
