import { useEffect, useState } from 'react'

import { cafeAPI } from "../api/cafeAPI"
import { Categoria, GetCategoriasResponse } from '../interfaces/appInterfaces'

export const useCategorias = () => {

    //! BUENA TECNICA ESTA DE CREAR UN "ISLOADING" SIEMPRE Y ACTUALIZARLOS DEPENDIENDO LO QUE SUCEDA, ASI EVITO ESTAR USANDO REDUX Y CREAR ESTE CONTROL DESDE ALLA...
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const getCateogories = async () => {
        try {
            const { data } = await cafeAPI.get<GetCategoriasResponse>('/categorias')
            setCategorias(data.categorias)
            setIsLoadingCategories(false)
            // console.log('RESPONSE CATEGORIA >> ', data.categorias)
        } catch (error) {
            console.log('ERROR RESP CATEGORIA >> ', error)
        }
    }

    //* Traer categorias
    useEffect(() => {
        getCateogories()
    }, [])



    return {
        categorias,
        isLoadingCategories
    }
}
