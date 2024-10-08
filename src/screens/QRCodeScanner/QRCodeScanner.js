import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRCodeScanner() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Quét mã QR tích điểm</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});