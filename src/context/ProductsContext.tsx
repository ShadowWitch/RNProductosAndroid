import { useEffect, useState, createContext } from 'react'

import { CreateProductData, GetProductsResponse, Producto } from "../interfaces/appInterfaces"
import { cafeAPI } from '../api/cafeAPI'
// import { ImagePickerAsset } from 'expo-image-picker'
import { Alert } from 'react-native'

type ProductsContextProps = {
    products: Producto[],
    isLoadingUploadImage: boolean,
    loadProducts: () => Promise<void>,
    addProduct: (categoryId: string, productName: string) => Promise<void>,
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>,
    deleteProduct: (id: string) => Promise<void>,
    loadProductById: (id: string) => Promise<Producto>,
    uploadImage: (data: any, id: string) => Promise<void> // TODO: cambiar ANY
}

export const ProductsContext = createContext({} as ProductsContextProps)

export const ProductsProvider = ({ children }: any) => {

    const [products, setProducts] = useState<Producto[]>([])

    const [isLoadingUploadImage, setIsLoadingUploadImage] = useState(false)


    //* Cargar productos
    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const resp = await cafeAPI.get<GetProductsResponse>('/productos?limite=100')
            setProducts([...resp.data.productos])
            // console.log('RESPONSE PRODUCTOS >> ', resp.data.productos);
            // console.log('LISTA PRO >> ', products)
        } catch (error) {
            console.log('ERRORSITO >> ', error)
        }
    }

    // TODO: Terminar la parte de eliminar productos como tarea
    const deleteProduct = async (id: string): Promise<void> => {
        try {
            const { data } = await cafeAPI.delete<Producto>(`/productos/${id}`)
            // console.log('PRODUCTS ARAR >> ', JSON.stringify(products, null, 3));

            setProducts(products.filter(e => e._id !== data._id))

        } catch (error) {
            console.log('ERROR DELTE >> ', error);
        }

    }

    const uploadImage = async (data: any, id: string) => {

        console.log('SI ME EJECUTE antes');

        console.log('DATA >> ', data);

        let fileName = data.uri.split('/').pop()
        let match = /\.(\w+)$/.exec(fileName)
        let type = match ? `image/${match[1]}` : 'image'

        let formData = new FormData()
        formData.append('archivo', { uri: data.uri, name: fileName, type } as any)

        console.log('FORM >> ', JSON.stringify(formData, null, 3));

        // return;
        try {
            console.log('SI ME EJECUTE');
            setIsLoadingUploadImage(true)

            const resp = await cafeAPI.put(`/uploads/productos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

            setIsLoadingUploadImage(false)
            // console.log('SI ME EJECUTE DESPUES');
            console.log('RESPONSE SUBIDA >> ', resp);
            Alert.alert('Imagen subida', 'Su imagen se subio con exito!')
        } catch (error: any) {
            setIsLoadingUploadImage(false)
            console.log('ERROR SUBIR FOTO >>', error);
            Alert.alert('Error imagen', 'Error al subir su imagen!')
        }
    }

    const loadProductById = async (id: string): Promise<Producto> => {
        try {
            const resp = await cafeAPI.get<Producto>(`/productos/${id}`)
            // console.log('RESP ONE PRODUCT >> ', resp.data)
            return resp.data
        } catch (error) {
            console.log('ERRORSITO >> ', error)
            return {} as Producto
        }
    }

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        try {
            const { data } = await cafeAPI.put<Producto>(`/productos/${productId}`, {
                nombre: productName,
                categoria: categoryId,
            })

            // setProducts([...products, data])
            setProducts(products.map(prod => (
                prod._id === productId ? data : prod
            )))
            // console.log('MI RESP UPDATE PRODUCT >> ', data);

        } catch (error: any) {
            console.log('ERROR UPDATE PRODUCT >> ', error.response.data.msg || 'Error en la consulta');
        }

        // console.log('UPDATE PRODUCTO');
        // console.log({ categoryId, productName, productId })
    }

    const addProduct = async (categoryId: string, productName: string) => {
        try {
            const { data } = await cafeAPI.post<Producto>('/productos', {
                nombre: productName,
                categoria: categoryId,
            } as CreateProductData)

            setProducts([...products, data])
            // console.log('MI RESP ADD PRODUCT >> ', data);

            // return data;

        } catch (error: any) {
            console.log('ERROR ADD PRODUCT >> ', error.response.data.msg || 'Error en la consulta');
        }
        // console.log('ADD PRODUCTO');
        // console.log({ categoryId, productName })
    }


    return (
        <ProductsContext.Provider value={{
            products,
            isLoadingUploadImage,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage,
        }}>
            {children}
        </ProductsContext.Provider>
    )
}
