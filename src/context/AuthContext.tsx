import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useReducer, useEffect } from 'react'
import { LoginData, LoginResponse, RegisterData, Usuario } from '../interfaces/appInterfaces'
import { AuthState, authReducer } from './AuthReducer'
import { cafeAPI } from '../api/cafeAPI'

type AuthContextProps = {
    errorMessage: string,
    token: string | null,
    user: Usuario | null,
    status: 'checking' | 'authenticated' | 'not-authenticated',
    signUp: ({ }: RegisterData) => void,
    signIn: ({ }: LoginData) => void,
    logOut: () => void,
    removeError: () => void,
}

const authInitialState: AuthState = {
    errorMessage: '',
    token: null,
    status: 'checking',
    user: null
}

export const AuthContext = createContext({} as AuthContextProps)

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState)


    //* Extraer Token del dispositivo
    useEffect(() => {
        checkToken()
    }, [])

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token')

        //* Si no hay token, no estara autenticado..
        if (!token) return dispatch({ type: 'notAuthenticated' })

        //* Hay token, renovarlo y verificar que este bueno...
        try {
            const resp = await cafeAPI.get<LoginResponse>('/auth')
            console.log('RESPONSE BUENA >> ', resp);
            dispatch({
                type: 'signUp',
                payload: {
                    user: resp.data.usuario,
                    token: resp.data.token
                }
            })
        } catch (error) {
            return dispatch({ type: 'notAuthenticated' })
        }
    }

    const signIn = async ({ correo, password }: LoginData) => {
        try {
            const { data } = await cafeAPI.post<LoginResponse>('/auth/login', {
                correo,
                password
            })
            // console.log(JSON.stringify(data, null, 3));
            dispatch({
                type: 'signUp',
                payload: {
                    user: data.usuario,
                    token: data.token
                }
            })

            //* Guardar Token en el Storage
            await AsyncStorage.setItem('token', data.token)

        } catch (error: any) {
            console.log('ERROR LOGIN >> ', error);
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Informacion incorrecta.'
            })
        }
    }

    // * Logout Usuario
    const logOut = async () => {
        await AsyncStorage.removeItem('token')
        dispatch({ type: 'logout' })
    }

    //* Registrar Usuario
    const signUp = async ({ correo, nombre, password }: RegisterData) => {
        try {
            const { data } = await cafeAPI.post<LoginResponse>('/usuarios', { correo, nombre, password } as RegisterData)
            console.log('RESPONSE >> ', data)

            dispatch({
                type: 'signUp',
                payload: {
                    user: data.usuario,
                    token: data.token
                }
            })

            //* Guardar Token en el Storage
            await AsyncStorage.setItem('token', data.token)

        } catch (error: any) {
            console.log(error.response.data);
            dispatch({
                type: 'addError',
                payload: error.response.errors[0].msg || 'Revise la informacion.'
            })
        }
    }

    const removeError = () => {
        dispatch({
            type: 'removeError'
        })
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            signIn,
            signUp,
            logOut,
            removeError,
        }}>
            {children}
        </AuthContext.Provider>
    )

}

