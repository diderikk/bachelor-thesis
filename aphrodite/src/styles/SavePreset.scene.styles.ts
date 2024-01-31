import {StyleSheet} from 'react-native';
import AddIdStyles from './AddIdForm.component.style';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
		alignItems: 'center',
		paddingVertical: 20
  },
  title: {
    ...AddIdStyles.title,
		top: undefined,
		marginBottom: 20,
  },
  input: {
    minHeight: 64,
    maxHeight: 64,
    minWidth: '90%',
    maxWidth: '90%',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 6,
    backgroundColor: 'white',
  },
	colorPicker: {
		...AddIdStyles.colorPicker
	},
	text: {
		...AddIdStyles.text,
		alignSelf: 'flex-start'
	}
});

export default styles;
