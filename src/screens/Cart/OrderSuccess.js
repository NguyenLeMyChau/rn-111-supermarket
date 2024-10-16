import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Hoặc một icon khác bạn muốn sử dụng
import { useNavigation } from '@react-navigation/native';

const OrderSuccess = () => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="check-circle" size={80} color="blue" />
            </View>
            <Text style={styles.title}>Your order has been accepted</Text>
            <Text style={styles.subtitle}>Your items have been placed and are on their way to being processed.</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('TrackOrder')}>
                <Text style={styles.buttonText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Cart')}>
                <Text style={styles.buttonText}>Quay về giỏ hàng</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    totalPrice: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default OrderSuccess;
