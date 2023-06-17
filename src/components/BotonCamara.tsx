
import { View, TouchableOpacity, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';


interface Props {
    onPress: () => Promise<void>,
    iconName: string,
}

export const BotonCamara = ({ onPress, iconName = '' }: Props) => {
    return (
        <TouchableOpacity style={{
            width: 100,
            height: 50,
            backgroundColor: '#5856D6',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            // position: 'absolute',
            bottom: 50
        }}
            activeOpacity={0.5}
            onPress={onPress}


        >
            <Ionicons
                name={iconName}
                size={30}
                color={'white'}
            />
        </TouchableOpacity>
    )
}
