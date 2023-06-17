
import { View, Image } from 'react-native'

export const WhiteLogo = () => {
    return (
        <View style={{
            alignItems: 'center',
            // justifyContent: 'center'
            // flex: 1
        }}>
            <Image
                source={require('../assets/react-logo-white.png')}
                style={{
                    width: 110,
                    height: 100
                }}
            />

        </View>
    )
}
