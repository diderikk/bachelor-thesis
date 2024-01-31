import {StyleSheet} from 'react-native';
import PreviewStyles from './Preview.scene.style'
import GlobalStyles from './Global.styles'

const styles = StyleSheet.create({
  shareDataContainer: {
		...PreviewStyles.previewContainer,
		backgroundColor: GlobalStyles.color.secondaryColor,
	},
	attributesContainer: {
		...PreviewStyles.attributesContainer,
		height: "75%",
	},
	buttonsContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignSelf: 'flex-end',
		width: "100%",
		justifyContent: 'center',
	},
	title: {
		...PreviewStyles.cardTitle
	},
	subTitle: {
		color: 'white',
		fontSize: 20
	}
});

export default styles;
