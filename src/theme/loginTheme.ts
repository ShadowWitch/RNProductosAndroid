
import { StyleSheet } from 'react-native'


export const loginTheme = StyleSheet.create({
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        height: 600

    },

    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },

    emailTitle: {
        fontSize: 10,
        color: 'white',
        marginTop: 20
    },


    inputField: {
        fontSize: 10,
        paddingBottom: 10,
        color: 'white'
    },

    buttonContainer: {
        // backgroundColor: 'red',
        alignItems: 'center',
        marginTop: 50
    },

    button: {
        borderWidth: 2,
        borderColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 100
    },

    titleTextLoginOrRegister: {
        fontSize: 10,
        color: 'white'
    },

    newUserContainer: {
        alignItems: 'center',
        marginTop: 30,
        // backgroundColor: 'red',
    },

    buttonReturn: {
        position: 'absolute',
        top: 50,
        left: 20,
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100

    }

})