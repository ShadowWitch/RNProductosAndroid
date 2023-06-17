import { useContext, useEffect } from 'react';

import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Platform, Keyboard, Alert } from "react-native"
import { Background } from "../components/Background"
import { WhiteLogo } from "../components/WhiteLogo"
import { loginTheme } from "../theme/loginTheme"
import { appTheme } from "../theme/AppTheme"
import { useForm } from "../hooks/useForm"
import { StackScreenProps } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"
import { AuthContext } from '../context/AuthContext';


interface Props extends StackScreenProps<any, any> { }

export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, removeError, errorMessage } = useContext(AuthContext)

    const { correo, password, onChange } = useForm({
        correo: '',
        password: ''
    })

    // * Mostrar alerta
    useEffect(() => {
        if (errorMessage.length === 0) return;
        Alert.alert(
            'Login incorrecto',
            errorMessage,
            [
                {
                    text: 'Ok',
                    onPress: removeError
                }
            ]
        )

    }, [errorMessage])


    const onLogin = () => {
        // console.log({ correo, password });
        Keyboard.dismiss()
        signIn({ correo, password })
    }

    return (
        <>
            {/* Background */}
            < Background />


            <KeyboardAvoidingView
                style={{ flex: 1, }}
                // behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
                behavior="height"
            >
                <ScrollView>

                    <View style={loginTheme.formContainer}>

                        {/* Keyboard avoid view */}
                        <WhiteLogo />

                        <Text style={loginTheme.title}>Login</Text>

                        <Text style={loginTheme.emailTitle}>Email:</Text>

                        <TextInput
                            placeholder="Ingrese su email"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            keyboardType="email-address"
                            underlineColorAndroid='white'
                            selectionColor={'white'}

                            style={loginTheme.inputField}

                            // TODO onChange
                            onChangeText={(value) => onChange(value, 'correo')}
                            value={correo}
                            onSubmitEditing={onLogin} //* Para que al darle enter se envie automaticamente

                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Text style={loginTheme.emailTitle}>Password:</Text>

                        <TextInput
                            placeholder="**********"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            underlineColorAndroid='white'
                            selectionColor={'white'}
                            // secureTextEntry={true} //* Para que al escribir oculte el texto como contrasenia

                            secureTextEntry
                            style={loginTheme.inputField}

                            // TODO onChange
                            onChangeText={(value) => onChange(value, 'password')}
                            value={password}
                            onSubmitEditing={onLogin} //* Para que al darle enter se envie automaticamente

                            autoCapitalize="none"
                            autoCorrect={false}
                        />


                        {/* Boton Login */}
                        <View style={loginTheme.buttonContainer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={loginTheme.button}
                                onPress={onLogin}
                            >
                                <Text style={loginTheme.titleTextLoginOrRegister}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Crear nueva cuenta */}
                        <View style={loginTheme.newUserContainer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.replace('RegisterScreen')}

                            >
                                <Text style={loginTheme.titleTextLoginOrRegister}>Crear cuenta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

            </KeyboardAvoidingView >

        </>
    )
}

