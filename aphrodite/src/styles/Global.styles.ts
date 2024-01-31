import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  color: {
    color: '#EFC88B',
    disableColor: '#C5C5C6',
    secondaryColor: '#3C3C3C'
  },
  viewColumn: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewRow: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    minHeight: 50,
    maxHeight: 50,
    minWidth: "90%",
    maxWidth: "90%",
    display: "flex",
    justifyContent: "center",
    fontSize: 20,
    marginBottom: 5,
  },
  textInputView: {
    display: "flex",
    flexDirection: 'column',
    alignItems: "flex-start",
    marginBottom: 15,
    marginTop: 5,
  },
  errorText: {
    fontSize: 14,
    color: "red",
  }
});

export default styles;
