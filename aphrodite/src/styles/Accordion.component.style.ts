import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
		marginVertical: 5,
		borderColor: 'white',
		borderWidth: 2,
		paddingHorizontal: 10,
		paddingVertical: 5
  },
  topContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
		color: 'white',
    fontSize: 20,
  },
});

export default style;
