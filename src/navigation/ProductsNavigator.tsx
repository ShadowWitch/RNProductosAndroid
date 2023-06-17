import { createStackNavigator } from "@react-navigation/stack"
import { OneProductScreen } from "../screens/OneProductScreen"
import { ProductsScreen } from "../screens/ProductsScreen"

export type ProductsStackParams = {
    ProductsScreen: undefined,
    OneProductScreen: { id?: string, name?: string }
}

const Stack = createStackNavigator<ProductsStackParams>()

export const ProductsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyle: {
                    backgroundColor: 'white'
                },
                headerStyle: {
                    elevation: 0,
                    // shadowColor: 'transparent'
                }
            }}
        >
            <Stack.Screen
                name="ProductsScreen"
                component={ProductsScreen}
            />
            <Stack.Screen
                name="OneProductScreen"
                component={OneProductScreen}
                options={{ title: 'Productos' }}
            />
        </Stack.Navigator>
    )
}
