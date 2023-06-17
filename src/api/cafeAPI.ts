import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://192.168.0.107:3000/api'

export const cafeAPI = axios.create({ baseURL })

// * Middleware para estar enviando el token 
cafeAPI.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token')
        if (token) {
            config.headers['x-token'] = token //* Esto esta entre medio de "[]" porque no podemos poner "config.headers.x-token" ya que ese "menos (-)" no lo permite, ya si solo se llamara "token" a la hora de recibirlo en el backend si podriamos poner "config.headers.token" sin necesidad de usar los "[]"
        }

        return config;
        //* Esta "config" es como poner el {headers: {'x-token': token}} y cosas asi luego de poner la URL de la API a la hora de hacer una solicitud, pero en este caso como siempre le estaremos enviando el token, para no hacer eso en cada solicitud mejor lo ponemos aqui y nos evitamos escribir esa configuracion en todos lados...
    }
)