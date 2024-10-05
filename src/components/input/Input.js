import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import colors from '../../constants/Color';

export default function Input({ Icon, nameIcon, onClick, placeholder, value, onChangeText, secureTextEntry, IconEnd, nameIconEnd, onPressIconEnd }) {

    return (
        <View style={styles.container}>

            {Icon && (
                <Icon name={nameIcon} size={24} color="black" onClick={onClick} />
            )}

            <TextInput
                style={[styles.input, Icon ? styles.inputWithIcon : null]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />

            {IconEnd && (
                <TouchableOpacity style={styles.flexend} onPress={onPressIconEnd}>

                    <IconEnd name={nameIconEnd} size={30} color="white" />

                </TouchableOpacity>
            )}

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        paddingLeft: 20

    },

    input: {
        flex: 1,
        padding: 8,
        paddingLeft: 16,
        color: 'black'
    },

    inputWithIcon: {
        paddingLeft: 16 // Thêm khoảng cách nếu có icon
    },

    flexend: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        backgroundColor: colors.button,
        flexDirection: 'row',
        borderRadius: 4
    }
});