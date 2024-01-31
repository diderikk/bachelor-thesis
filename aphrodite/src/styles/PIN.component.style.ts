import {StyleSheet} from 'react-native';
import globalStyles from './Global.styles';

const styles = StyleSheet.create({
  PINTitle: {
    fontSize: 30,
  },
  PINSubTitleError: {
    fontSize: 20,
    color: 'red',
  },
  PINLockTimeText: {
	fontSize: 25,
	fontWeight: 'bold',
  },
  viewContainer: {
    ...globalStyles.viewColumn,
    marginVertical: '10%',
  },
  PINBallSmall: {
    height: 25,
    width: 25,
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderColor: globalStyles.color.color,
    borderWidth: 2,
	borderRadius: 50,
  },
  PINBall: {
    height: 25,
    width: 25,
    marginHorizontal: 5,
	borderRadius: 50,
    backgroundColor: globalStyles.color.color,

  },
  PINRow: {
    ...globalStyles.viewRow,
    flex: 0,
  },
  PINInput: {
    display: 'flex',
    justifyContent: 'center',
    margin: 10,
    height: 65,
    width: 65,
    marginHorizontal: 10,
    borderRadius: 50,
    color: 'white',
  },
});

export default styles;
