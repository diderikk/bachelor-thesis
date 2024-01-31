import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
		width: "100%",
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 10
	},
	
	text: {
		color: "white",
		fontSize: 20
	},
	switch: {
		transform : [{scaleX: 1.5}, {scaleY: 1.5}]
	}
});

export default styles;
