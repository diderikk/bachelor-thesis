import {StyleSheet} from 'react-native';
import globalStyles from './Global.styles'

const styles = StyleSheet.create({
	previewContainer: {
		...globalStyles.viewColumn,
		margin: 10,
		borderRadius: 20,
		padding: 40,
	},
	attributesContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: "100%",
	},
	cardTitle: {
		color: "white",
		fontSize: 35,
		marginBottom: 20
	}
});

export default styles;