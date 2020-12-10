import React, {useRef} from 'react';
import {Text, StyleSheet, Dimensions, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  abs,
  add,
  and,
  block,
  Clock,
  clockRunning,
  cond,
  eq,
  event,
  lessThan,
  min,
  not,
  set,
  spring,
  startClock,
  stopClock,
  timing,
  useCode,
  useValue,
  Easing,
  call,
} from 'react-native-reanimated';
import {Todo, useTodoDispatch} from '../context/TodoContext';
import Action from './Action';

const HEIGHT = 80;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: HEIGHT,
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    margin: 8,
    marginLeft: 0,
    backgroundColor: '#E30425',
    borderRadius: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: '500',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E1E2E3',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

const {width} = Dimensions.get('window');

export const TodoItem = ({id, title, description}: Todo) => {
  const clock = useRef(new Clock()).current;
  const dispatch = useTodoDispatch();
  const translateX = useValue(0);
  const offsetX = useValue(0);
  const finished = useValue(0);
  const height = useValue(HEIGHT);
  const to = useValue<number>(0);
  const gestureState = useValue(State.UNDETERMINED);
  const shouldDelete = useValue<number>(0);

  const deleteItem = () => {
    dispatch({
      type: 'delete-todo',
      todo: {id: id, title: title, description: description},
    });
  };

  useCode(
    () => [
      cond(and(clockRunning(clock), eq(gestureState, State.END)), [
        cond(lessThan(translateX, -100), set(to, -100), set(to, 0)),

        spring(
          clock,
          {
            finished: finished,
            position: translateX,
            velocity: new Animated.Value(0),
            time: new Animated.Value(0),
          },
          {
            toValue: to,
            damping: 20,
            mass: 0.2,
            stiffness: 100,
            overshootClamping: false,
            restSpeedThreshold: 0.2,
            restDisplacementThreshold: 0.2,
          },
        ),
        cond(finished, [
          set(offsetX, translateX),
          set(finished, new Animated.Value(0)),
          stopClock(clock),
        ]),
      ]),
      cond(shouldDelete, [
        startClock(clock),
        spring(
          clock,
          {
            finished: new Animated.Value(0),
            position: translateX,
            velocity: new Animated.Value(0),
            time: new Animated.Value(0),
          },
          {
            toValue: new Animated.Value(-width),
            damping: 20,
            mass: 0.2,
            stiffness: 100,
            overshootClamping: false,
            restSpeedThreshold: 0.2,
            restDisplacementThreshold: 0.2,
          },
        ),
        timing(
          clock,
          {
            frameTime: new Animated.Value(100),
            finished: finished,
            position: height,
            time: new Animated.Value(0),
          },
          {
            duration: width,
            toValue: 0,
            easing: Easing.linear,
          },
        ),

        cond(finished, [
          set(finished, new Animated.Value(0)),
          set(shouldDelete, 0),
          stopClock(clock),
        ]),
        cond(not(clockRunning(clock)), call([], deleteItem)),
      ]),
    ],

    [deleteItem],
  );

  const _onPanGestureEvent = event<PanGestureHandlerGestureEvent>(
    [
      {
        nativeEvent: ({translationX}) =>
          block([
            cond(eq(gestureState, State.ACTIVE), [
              set(translateX, add(offsetX, min(translationX, 0))),
            ]),
          ]),
      },
    ],
    {useNativeDriver: true},
  );

  const _onHandleStateChange = event<PanGestureHandlerStateChangeEvent>([
    {
      nativeEvent: ({state}) =>
        block([
          set(gestureState, state),

          cond(and(eq(gestureState, State.END), not(clockRunning(clock))), [
            startClock(clock),
          ]),
        ]),
    },
  ]);

  return (
    <Animated.View>
      <View style={styles.background}>
        <TouchableWithoutFeedback onPress={() => shouldDelete.setValue(1)}>
          <Action x={abs(translateX)} />
        </TouchableWithoutFeedback>
      </View>
      <PanGestureHandler
        onGestureEvent={_onPanGestureEvent}
        onHandlerStateChange={_onHandleStateChange}>
        <Animated.View
          style={[styles.item, {height}, {transform: [{translateX}]}]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};
