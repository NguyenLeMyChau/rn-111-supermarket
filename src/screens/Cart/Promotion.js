import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Promotion() {
    const navigation = useNavigation();
    const [promoCode, setPromoCode] = useState('');

    const handleApplyPromoCode = () => {
        // Giả sử bạn có logic kiểm tra mã khuyến mãi ở đây
        if (promoCode === 'DISCOUNT10') {
            Alert.alert('Thành công', 'Mã khuyến mãi đã được áp dụng!');
        } else {
            Alert.alert('Thất bại', 'Mã khuyến mãi không hợp lệ.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Nhập mã khuyến mãi</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Nhập mã khuyến mãi"
                value={promoCode}
                onChangeText={setPromoCode}
            />
            <TouchableOpacity style={styles.button} onPress={handleApplyPromoCode}>
                <Text style={styles.buttonText}>Áp dụng</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 8,
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});