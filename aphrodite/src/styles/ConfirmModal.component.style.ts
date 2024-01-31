import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'grey',
    opacity: 0.5,
  },
  innerContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 300,
    width: 300,
		alignSelf: 'center',
		bottom: "30%",
		borderRadius: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		paddingHorizontal: 20,
		paddingVertical: 15,
  },
	buttonContainer: {
		width: "100%",
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	title: {
		fontSize: 30,
	},
	subTitle: {
		fontSize: 15,
		color: 'grey'
	},
	button: {
		height: 40,
		width: 100,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText:{
		color: 'white',
		fontSize: 13
	}
});

export default style;
