import { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Button, ActivityIndicator, Image, Alert, Platform, } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { Picker } from '@react-native-picker/picker';

import { ProductsStackParams } from '../navigation/ProductsNavigator'
import { useCategorias } from '../hooks/useCategorias';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

//! TESTEANDO LO DE CAMARA
import * as ImagePicker from 'expo-image-picker';

import * as MediaLibrary from 'expo-media-library';
import { Camera, CameraType } from 'expo-camera';
import { BotonCamara } from '../components/BotonCamara';


//* Mas TESTING

interface Props extends StackScreenProps<ProductsStackParams, 'OneProductScreen'> { }

export const OneProductScreen = ({ navigation, route }: Props) => {
    const { id = '', name = '' } = route.params

    const [tempUri, setTempUri] = useState<string>()

    const { categorias, isLoadingCategories } = useCategorias()
    const { loadProductById, addProduct, updateProduct, deleteProduct, uploadImage, isLoadingUploadImage } = useContext(ProductsContext)

    const { _id, categoriaId, nombre, img, form, onChange: onChangeForm, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: ''
    })

    const loadProduct = async () => {
        if (_id.length === 0) return;
        const product = await loadProductById(_id)
        setFormValue({
            _id: product._id,
            categoriaId: product.categoria._id,
            nombre: product.nombre,
            img: product.img || ''
        })
    }

    const saveOrUpdate = () => {
        if (id.length > 0) {
            console.log('Actualizando');
            updateProduct(categoriaId, nombre, _id)
        } else {
            if (categoriaId.length === 0) {
                onChangeForm(categorias[0]._id, 'categoriaId')
            }
            const tempCategoridaId = categoriaId || categorias[0]._id;
            addProduct(tempCategoridaId, nombre)
            console.log('Creando')
        }
    }

    const deleteProductById = async () => {
        if (id.length === 0) {
            console.log('ERROR AL BORRAR PRODUCTO')
            Alert.alert('Error el eliminar', 'El producto que intenta eliminar no existe.', [{
                text: 'Cancelar',
                onPress: () => console.log('CANCELADO!'),
                style: 'cancel'
            },
            {
                text: 'Ok',
                onPress: () => console.log('CANCELADO!'),
                style: 'cancel'
            }]
            )

        } else {
            // await deleteProduct(id)
            Alert.alert('Advertencia!', 'Una vez eliminado ya no hay vuelta atras, esta seguro?', [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('CANCELADO!'),
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        await deleteProduct(id)
                        // console.log('Mostrarme despues de borrar peticion');
                    },
                    style: 'destructive'
                }
            ])
        }
    }

    //! Con las funciones permisoGaleria, lanzarCamara y pickImage ya funciona normal como en el video...
    // * Pedir permiso para acceder a la galeria...
    const permisoGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        console.log('STATUS GALERIA >> ', status);
    }

    // * Pedir permiso de camara, tomar foto ABRIENDO TODA LA CAMARA y guardarla...
    const lanzarCamara = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        console.log('ACA ESTATUS Camara >> ', status);
        if (status !== 'granted') {
            Alert.alert('Error camara', 'Lo sentimos, necesita acceder a su camara.`')
            return;
        }
        console.log('IZIZ PAAA');
        const resp = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2
        })

        if (!resp.canceled) {
            if (!resp.assets[0].uri) return;
            setTempUri(resp.assets[0].uri)
        }

    }

    const pickImage = async () => {
        let resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2
        })

        console.log('HOLa');

        if (!resultado.canceled) {
            // console.log('REs >> ', resultado.assets);
            setTempUri(resultado.assets[0].uri)
            console.log('ANTES DE TODO!!');

            uploadImage(resultado.assets[0], id)
        }
    }



    //! ====================================== ZONA DE TESTEO ===================================================

    const [hastaCameraPermission, setHastaCameraPermission] = useState(false)

    const [type, setType] = useState(Camera.Constants.Type.back)
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
    const cameraRef = useRef(null)

    // ! READY GOOOOOOOOOOOOO
    // * Pedir permiso de galeria, buscar imagen y subirla
    const permisoMedia = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync() //* Permiso a los archivos del telefono
        if (status !== 'granted') {
            return Alert.alert('Error', 'Necesitamos acceder a su galeria..')
        }

        let resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2
        })

        console.log('RESULTADO IM AGE > ', resultado);

        if (!resultado.canceled) {
            // console.log('REs >> ', resultado.assets);
            setTempUri(resultado.assets[0].uri)
            console.log('ANTES DE TODO!!');

            uploadImage(resultado.assets[0], id)
        }
    }

    // ! READY GOOOOOOOOOOOOO
    // * Pedir permiso a la camara y la galeria, toma foto y la camara se muestra en una zona que defini con el componente <Camera></Camera> similar al que usaron en el sistema de votacion en mi pais...
    const permisoCamara = async () => {
        //* Tengo que pedir permiso de GALERIA Y CAMARA si no NO me dejara tomar fotos...
        const { status: statusGaleriaPermission } = await MediaLibrary.requestPermissionsAsync() //* Permiso a los archivos del telefono
        if (statusGaleriaPermission !== 'granted') {
            return Alert.alert('Error', 'Necesitamos acceder a su galeria..')
        }
        console.log('Sttus Galeria >> ', statusGaleriaPermission);

        const { status: statusCameraPermission } = await Camera.requestCameraPermissionsAsync()
        if (statusCameraPermission !== 'granted') {
            return Alert.alert('Error', 'Necesitamos acceder a su camara..')
        }
        setHastaCameraPermission(true)
    }

    const tomarFotito = async () => {

        console.log('URI ANTERIOR >> ', tempUri);
        if (hastaCameraPermission) {
            if (cameraRef !== null) {
                try {
                    const { uri } = await cameraRef.current.takePictureAsync();
                    const asset = await MediaLibrary.createAssetAsync(uri);
                    console.log('ASET >> ', asset);
                    // setTempUri(uri)
                    uploadImage(asset, id)

                } catch (error) {
                    console.log('ERROR TOAMR >> ', error);
                }

            }
        } else {
            Alert.alert('Error camara', 'Necesitamos permiso para acceder a su camara.')
        }

    }


    //! =========================================================================================================

    // !TESTING CA
    const takePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            // allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            if (!result.assets[0].uri) return;

            // console.log('ACA MAN >> ', result);
            console.log('MI FILE NAME >> ', result.assets[0]);
            setTempUri(result.assets[0].uri)
            uploadImage(result.assets[0], id)

        }
    };

    //* Configurar Titulo
    useEffect(() => {
        navigation.setOptions({
            title: (nombre.length > 0) ? nombre : 'Nombre del producto'
        })
    }, [nombre])

    //* Cargar un solo producto
    useEffect(() => {
        loadProduct()
    }, [])

    return (
        <View style={stylesOneProductScreen.container}>
            <ScrollView>
                <Text style={stylesOneProductScreen.label}>Nombre del producto: </Text>
                <TextInput
                    style={stylesOneProductScreen.textInputs}
                    placeholder='e.x. Producto'
                    cursorColor='black'

                    // TODO
                    value={nombre}
                    onChangeText={(value) => onChangeForm(value, 'nombre')}
                />

                {/* Picker / Selector */}
                <Text style={stylesOneProductScreen.label}>Categoria: </Text>

                {
                    isLoadingCategories === true
                        ? (
                            <View style={{
                                // backgroundColor: 'red',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 8 }}>Cargando categorias...</Text>
                                <ActivityIndicator size={30} color='#5856D6' />
                            </View>
                        )
                        :
                        (
                            <Picker
                                selectedValue={categoriaId}
                                onValueChange={(itemValue, indexValue) => {
                                    // setSelectCategory(itemValue)
                                    onChangeForm(itemValue, 'categoriaId')
                                }}
                            >
                                {
                                    categorias.map(e => (
                                        <Picker.Item
                                            label={e.nombre}
                                            value={e._id}
                                            key={e._id}
                                        />
                                    ))
                                }
                            </Picker>
                        )
                }

                <Button
                    title='Guardar'
                    color='#5856D6'
                    onPress={saveOrUpdate}
                />

                <Button
                    title='Eliminar'
                    color='#5856D6'
                    onPress={deleteProductById}
                />

                {
                    (id.length > 0)
                    && (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 10
                        }}>
                            <Button
                                title='Camara'
                                onPress={permisoCamara}
                                color='#5856D6'
                            />
                            <View style={{ width: 10 }} />
                            <Button
                                title='Galeria'
                                onPress={permisoMedia}
                                color='#5856D6'
                            />

                        </View>
                    )
                }

                {/* <Text>
                    {JSON.stringify(form, null, 3)}
                </Text> */}
                {
                    isLoadingUploadImage && <ActivityIndicator size={30} color='red' />
                }

                {
                    (img.length > 0 && !tempUri) && (
                        <Image
                            source={{
                                uri: img
                            }}

                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300,
                                backgroundColor: 'red'
                            }}

                            resizeMode='stretch'
                        />
                    )
                }

                {/* TODO: Mostrar imagen temporal */}

                {
                    (tempUri) && (
                        <Image
                            source={{
                                uri: tempUri
                            }}

                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300,
                                backgroundColor: 'red'
                            }}

                            resizeMode='stretch'
                        />
                    )
                }


                {
                    hastaCameraPermission && (
                        <View style={{
                            backgroundColor: 'red',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // display: (isLoadingTomandoFoto ? 'none' : 'flex')
                        }}>
                            <Camera
                                style={{
                                    width: 300,
                                    height: 300
                                }}

                                type={type}
                                flashMode={flash}
                                ref={cameraRef}
                            >
                                <Text style={{
                                    fontSize: 30
                                }}>Hola mundo</Text>
                            </Camera>

                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: 'yellow',
                                justifyContent: 'space-evenly',
                                width: '100%'
                            }}>
                                <BotonCamara onPress={tomarFotito} iconName='camera-outline' />
                                <BotonCamara onPress={tomarFotito} iconName='image-outline' />
                            </View>
                        </View>
                    )
                }

            </ScrollView>
        </View>
    )
}

const stylesOneProductScreen = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10
        // backgroundColor: 'red'
    },

    label: {
        fontSize: 15
    },

    textInputs: {
        // backgroundColor: 'red',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        fontSize: 10,
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 20
    }
});