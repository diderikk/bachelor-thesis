import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  button: {
    position: 'absolute',
    top: "-70%",
		right: 5,
    width: 50,
    height: 25,
    margin: 8,
    resizeMode: 'contain',
  },
  optionsContainer: {
		position: 'absolute',
		top: "-70%",
		right: -5,
    width: 120,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    borderRadius: 15,
    backgroundColor: 'white',
		opacity: 0.9,
  },
  optionButton: {
    borderColor: 'lightgrey',
    borderBottomWidth: 1,
    borderRadius: 15,
    padding: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: 'center'
  },
  optionsText: {
    textAlign: 'center',
    fontSize: 20,
  },
  image: {
    width: 50,
    height: 25,
    margin: 8,
    resizeMode: 'contain',
  },
});

export default style;
