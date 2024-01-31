import {StyleSheet} from 'react-native';
import SwitchAttributeStyle from './SwitchAttribute.component.style'

const styles = StyleSheet.create({
	QRContainer: {
		backgroundColor: 'white'
	},
	QRTitle: {
		fontSize: 40,
		fontWeight: 'bold',
		marginBottom: 40,
	},
	attributeText: {
		...SwitchAttributeStyle.text
	}
});

export default styles;