import { StyleSheet } from 'react-native';
import SavePresetStyles from './SavePreset.scene.styles'

const style = StyleSheet.create({
    container: {
			...SavePresetStyles.container
		},
		title: {
			...SavePresetStyles.title
		},
		input: {
			...SavePresetStyles.input
		},
		colorPicker: {
			...SavePresetStyles.colorPicker
		}
});

export default style;