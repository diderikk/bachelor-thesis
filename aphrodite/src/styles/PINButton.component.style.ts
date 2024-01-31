import {StyleSheet} from 'react-native';
import PINButton from '../components/atoms/PINButton';
import globalStyles from './Global.styles';

const styles = StyleSheet.create({
  PINButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: 65,
    width: 65,
    marginHorizontal: 10,
    borderRadius: 50,
    underlayColor: 'white',
    backgroundColor: globalStyles.color.color,
  },
  PINButtonContainerDisabled: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: 65,
    width: 65,
    marginHorizontal: 10,
    borderRadius: 50,
    underlayColor: 'white',
    backgroundColor: globalStyles.color.disableColor,
  },
  PINButtonText: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
  },
  PINButtonTextDisabled: {
    fontSize: 30,
    fontWeight: '700',
    color: "grey"
  },
  PINDeleteButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: 65,
    width: 65,
    marginHorizontal: 10,
  },
});

export default styles;
