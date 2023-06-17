import { useContext } from 'react'

import { View, Text, Platform, KeyboardAvoidingView, Keyboard, TouchableOpacity } from "react-native"

import { Background } from "../components/Background"
import { loginTheme } from "../theme/loginTheme"
import { WhiteLogo } from "../components/WhiteLogo"
import { ScrollView, TextInput } from "react-native-gesture-handler"
import { useForm } from "../hooks/useForm"
import { StackScreenProps } from "@react-navigation/stack"
import { AuthContext } from '../context/AuthContext'


interface Props extends StackScreenProps<any, any> { }

export const RegisterScreen = ({ navigation }: Props) => {

    const { signUp } = useContext(AuthContext)

    const { form, correo, password, nombre, onChange } = useForm({
        correo: '',
        password: '',
        nombre: ''
    })

    const onRegister = () => {
        console.log({ correo, password, nombre });
        Keyboard.dismiss()
        signUp({ nombre, correo, password })
    }
    return (
        <>
            {/* Background */}
            < Background />


            <KeyboardAvoidingView
                style={{ flex: 1, }}
                behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
            // behavior="padding"
            >
                <ScrollView>

                    <View style={loginTheme.formContainer}>

                        {/* Keyboard avoid view */}
                        <WhiteLogo />

                        <Text style={loginTheme.title}>Registrarse</Text>

                        <Text style={loginTheme.emailTitle}>Nombre:</Text>

                        <TextInput
                            placeholder="Ingrese su nombre"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            keyboardType="default"
                            underlineColorAndroid='white'
                            selectionColor={'white'}

                            style={loginTheme.inputField}

                            // TODO onChange
                            onChangeText={(value) => onChange(value, 'nombre')}
                            value={nombre}
                            onSubmitEditing={onRegister} //* Para que al darle enter se envie automaticamente

                            autoCapitalize="words"
                            autoCorrect={false}
                        />

                        <Text style={loginTheme.emailTitle}>Correo electronico:</Text>

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
                            onSubmitEditing={onRegister} //* Para que al darle enter se envie automaticamente

                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Text style={loginTheme.emailTitle}>Contraseña:</Text>

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
                            onSubmitEditing={onRegister} //* Para que al darle enter se envie automaticamente

                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        {/* Boton Login */}
                        <View style={loginTheme.buttonContainer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={loginTheme.button}
                                onPress={onRegister}
                            >
                                <Text style={loginTheme.titleTextLoginOrRegister}>
                                    Registrarse
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Crear nueva cuenta */}
                        {/* <View style={loginTheme.newUserContainer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.replace('LoginScreen')}

                            >
                                <Text style={loginTheme.titleTextLoginOrRegister}>Iniciar sesion</Text>
                            </TouchableOpacity>
                        </View> */}
                        <TouchableOpacity
                            onPress={() => navigation.replace('LoginScreen')}
                            activeOpacity={0.8}
                            style={loginTheme.buttonReturn}
                        >
                            <Text style={loginTheme.titleTextLoginOrRegister}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </KeyboardAvoidingView >

        </>
    )
}
