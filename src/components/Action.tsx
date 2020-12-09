import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Animated, {
  add,
  cond,
  divide,
  Extrapolate,
  interpolate,
  lessThan,
  sub,
} from 'react-native-reanimated';

type ActionProps = {
  x: Animated.Node<number>;
};
const styles = StyleSheet.create({
  background: {
    backgroundColor: '#D93F12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 5,
    width: 20,
    backgroundColor: 'white',
  },
  outerlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remove: {
    color: 'white',
  },
});

const Action = ({x}: ActionProps) => {
  const size = cond(lessThan(x, 80), x, add(x, sub(x, 80)));
  const translateX = cond(lessThan(x, 80), 0, divide(sub(x, 80), 2));

  const borderRadius = divide(x, 2);
  const iconOpacity = interpolate(size, {
    inputRange: [70, 90],
    outputRange: [1, 0],
  });

  const scale = interpolate(size, {
    inputRange: [20, 30],
    outputRange: [0.001, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const textOpacity = sub(1, iconOpacity);

  return (
    <Animated.View
      style={[
        styles.background,
        {height: size, width: size, borderRadius},
        {transform: [{translateX}]},
      ]}>
      <Animated.View
        style={[styles.icon, {opacity: iconOpacity}, {transform: [{scale}]}]}
      />
      <Animated.View style={[styles.outerlay, {opacity: textOpacity}]}>
        <Text style={styles.remove}>Remove</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default Action;
