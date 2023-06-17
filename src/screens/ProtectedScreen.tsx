import { useContext } from 'react'
import { View, Text, StyleSheet, Button } from "react-native"
import { AuthContext } from '../context/AuthContext'

export const ProtectedScreen = () => {

    const { user, token, status, logOut } = useContext(AuthContext)

    return (
        <View style={stylesProtectedScreen.container}>
            <Text style={stylesProtectedScreen.title}>ProtectedScreen</Text>

            <Button
                title="Logout"
                color='#5856D6'
                onPress={logOut}
            />

            <Text>{JSON.stringify({ user, status, token, }, null, 5)}</Text>

        </View>
    )
}


const stylesProtectedScreen = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontSize: 20,
        marginBottom: 20
    }

});
