import { useContext, useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'
import { ProductsContext } from '../context/ProductsContext'
import { ProductsStackParams } from '../navigation/ProductsNavigator'


interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> { }

export const ProductsScreen = ({ navigation }: Props) => {

    const { products, loadProducts } = useContext(ProductsContext)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const loadProductsFromBackend = async () => {
        setIsRefreshing(true)
        await loadProducts()

        console.log('QUESOOO');
        setIsRefreshing(false)

    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                        // backgroundColor: 'red',
                        marginRight: 10
                    }}

                    onPress={() => navigation.navigate('OneProductScreen', {
                        name: 'Nuevo producto'
                    })}
                >
                    <Text>Agregar</Text>
                </TouchableOpacity>
            )

        })

    }, [])


    // TODO Crear "pulltoRefresh"
    return (

        <View
            style={{ flex: 1, marginHorizontal: 5, }}
        >
            <FlatList
                data={products}
                keyExtractor={(producto) => producto._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('OneProductScreen', {
                            id: item._id,
                            name: item.nombre
                        })}
                    >
                        <Text>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={stylesProductsScreen.itemSeparatorStyle} />
                )}


                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadProductsFromBackend}
                        progressViewOffset={20}
                        progressBackgroundColor={'red'}
                    />
                }
            />
        </View>
    )
}


const stylesProductsScreen = StyleSheet.create({
    productName: {
        fontSize: 20
    },

    itemSeparatorStyle: {
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginVertical: 5,
        borderBottomWidth: 1,
    }

});