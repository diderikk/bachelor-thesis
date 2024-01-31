import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 40,
		fontWeight: 'bold',
        padding: 10,
    },
    text: {
        color: 'white',
        fontSize: 16,
        padding: 20,
    },
    container: {
        alignItems: "center",
        justifyContent: 'space-between',
        backgroundColor: '#3C3C3C',
        margin: '2%',
        borderRadius: 10,
        display: 'flex',
        flex: 1,
        paddingVertical: 40,
    }
  });

  export default styles;