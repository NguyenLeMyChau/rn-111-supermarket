import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import colors from '../../constants/Color';

export default function Button({ TextValue, onPress, disabled }) {

    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonForm} disabled={disabled}>
            <Text style={styles.textButton}>{TextValue}</Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    buttonForm: {
        width: '100%',
        padding: 12,
        backgroundColor: colors.button,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },

    textButton: {
        color: colors.textButton,
    }
});