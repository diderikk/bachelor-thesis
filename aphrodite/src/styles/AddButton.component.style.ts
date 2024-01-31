import { StyleSheet } from 'react-native';
import styles from '../styles/Global.styles';

const style = StyleSheet.create({
    button: {
      position: 'absolute',
      left: '50%',
      bottom: '2%',
      backgroundColor: styles.color.color,
      flex: 1,
      transform: [{ translateX: -25 }],
    },
});

export default style;