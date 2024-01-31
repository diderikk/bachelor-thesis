import {StyleSheet} from 'react-native';
import globalStyles from "./Global.styles"

const styles = StyleSheet.create({
  registerView: {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'flex-start',
	flex: 1,
  },
  registerButton: {
    minHeight: 50,
    maxHeight: 50,
    minWidth: '90%',
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10,
    backgroundColor: globalStyles.color.color,
  },
});

export default styles;
