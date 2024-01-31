import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 5,
    margin: 5,
    height: 200,
  },
  text: {
    fontSize: 30,
    color: '#FFFFFF',
    top: '80%',
  },
  moreButton: {
    borderRadius: 50,
    shadowOpacity: 0,
  },
  actionContainer: {
    height: "37%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    backgroundColor: 'white',
  },
});

export default style;
