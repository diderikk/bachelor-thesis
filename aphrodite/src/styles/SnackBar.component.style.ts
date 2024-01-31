import {StyleSheet} from 'react-native';
import GlobalStyles from './Global.styles';

const style = StyleSheet.create({
  container: {
    borderRadius: 10,
    zIndex: 10,
    position: 'absolute',
    width: '70%',
    height: '10%',
    color: 'black',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    padding: 15,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
  },
});

export default style;
