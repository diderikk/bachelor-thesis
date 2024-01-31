import * as React from 'react';
import {ActivityIndicator, Animated, Dimensions, Easing} from 'react-native';
import {Text} from 'react-native-paper';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useSnackBar} from '../../context/SnackBarContext';
import SnackBarStyles from '../../styles/SnackBar.component.style';

const SnackBar: React.FC = () => {
  const {state, dispatch} = useSnackBar();
  const deviceHeight = Dimensions.get('window').height;
  const snackBarY = deviceHeight - 0.17 * deviceHeight;
  const swipeAnimation = React.useRef(new Animated.Value(snackBarY)).current;
  const fadeAnimation = React.useRef(new Animated.Value(1)).current;

  const handleSwipeDown = () => {
    Animated.timing(swipeAnimation, {
      toValue: deviceHeight,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.exp,
    }).start();
  };

  const handleSwipeUp = () => {
    Animated.timing(swipeAnimation, {
      toValue: -0.1 * deviceHeight,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.exp,
    }).start();
  };

  React.useEffect(() => {
    if (state.fadeOut || state.loading) {
      fadeAnimation.setValue(1);
      Animated.timing(swipeAnimation, {
        toValue: snackBarY,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.exp,
      }).start();
    }
  }, [state]);

  fadeAnimation.addListener(val => {
    if (val.value === 0) dispatch({type: 'disabled'});
    if (state.fadeOut && val.value === 1)
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 12000,
        useNativeDriver: true,
      }).start();
  });

  swipeAnimation.addListener(val => {
    if (val.value === deviceHeight || val.value === -0.1 * deviceHeight) {
      dispatch({type: 'disabled'});
      swipeAnimation.setValue(deviceHeight + 1);
    }
  });

  return state.show || state.fadeOut ? (
    <Animated.View
      style={{
        ...SnackBarStyles.container,
        opacity: fadeAnimation,
        translateY: swipeAnimation,
      }}>
      <GestureRecognizer
        onSwipeDown={() => handleSwipeDown()}
        onSwipeUp={() => handleSwipeUp()}
        style={SnackBarStyles.innerContainer}>
        {state.loading ? (
          <ActivityIndicator size="large" color="grey" />
        ) : (
          <Text style={{...SnackBarStyles.text, color: state.color}}>
            {state.description}
          </Text>
        )}
      </GestureRecognizer>
    </Animated.View>
  ) : null;
};

export default SnackBar;
