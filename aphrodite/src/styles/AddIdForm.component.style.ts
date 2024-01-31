import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    container: {
        flex: 1, 
        alignSelf: 'center', 
        alignContent: 'center',
    },
    title: {
        top: '5%',
        fontSize: 30,
        alignSelf: 'center',
    },
    nameInput: {
        top: '40%',
        minHeight: 64,
        maxHeight: 64,
        minWidth: "90%",
        maxWidth: "90%",
        fontSize: 16,
        marginBottom: 10,
        marginTop: 6,
        alignSelf: 'center',
        backgroundColor: "white",
    },
    providerInput: {
        alignSelf: 'center',
        minWidth: "90%",
        maxWidth: "90%",
        marginBottom: 10,
        marginTop: 10,
    },
    colorPicker: {
        display: 'flex',
        flex: 0.8,
        justifyContent: "center",
        alignSelf: 'center',
        minWidth: "90%",
        maxWidth: "90%",
        marginBottom: "10%",
    },
    text: {
        left: '5%',
        marginTop: 10,
        marginBottom: 10,
    },
    dropdownButton: {
        marginTop: 10,
        alignSelf: 'center',
        minWidth: "90%",
        maxWidth: "90%",
        minHeight: 60,
        maxHeight: 60,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        backgroundColor: "white",
    },
    dropdownText: { 
        color: "grey",
        textAlign: "left",
        fontSize: 16,
    },
    element: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    outterElement: {
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        justifyContent: 'space-between',
    },
    logo: {
        margin: 4,
        paddingRight: 5,
    },
    dropdownLogo: {
        margin: 4,
        paddingRight: 5,
    },
    error: {
        textAlign: 'left',
        marginTop: 1,
        fontSize: 12,
        color: 'red',
        left: '5%',
    },
});

export default style;