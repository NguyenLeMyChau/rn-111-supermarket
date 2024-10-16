import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePaymentModal } from '../../context/PaymentProvider';

export default function Promotion() {
    const navigation = useNavigation();

    const { setPromoCode, setIsInPaymentProcess } = usePaymentModal();
    const [promoCodePage, setPromoCodePage] = useState('');

    const handleApplyPromoCode = (promoCode) => {
        setPromoCode(promoCode);
        setIsInPaymentProcess(true);
        navigation.goBack();
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    setIsInPaymentProcess(true);
                    navigation.goBack();
                }}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Nhập mã khuyến mãi</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Nhập mã khuyến mãi"
                value={promoCodePage}
                onChangeText={setPromoCodePage}
            />
            <TouchableOpacity style={styles.button} onPress={() => handleApplyPromoCode(promoCodePage)}>
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