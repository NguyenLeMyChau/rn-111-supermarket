import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/Color';

const OrderSuccess = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image source={require('../../../assets/order-success.png')} style={styles.img} />
            </View>
            <Text style={styles.title}>Đặt hàng thành công!</Text>
            <Text style={styles.subtitle}>
                Các mặt hàng của bạn đang được chúng tôi xử lý. Cảm ơn bạn vì đã tin dùng
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}> CAPY SMART</Text>
            </Text>
            <TouchableOpacity
                style={styles.trackButton}
                onPress={() => navigation.navigate('TrackOrder')}>
                <Text style={styles.trackButtonText}>Theo dõi đơn hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cartButton}
                onPress={() => navigation.navigate('Cart')}>
                <Text style={styles.cartButtonText}>Quay về giỏ hàng</Text>
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
    trackButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: colors.primary,
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: 'transparent', // Không có nền cho nút "Quay về giỏ hàng"
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trackButtonText: {
        color: 'white', // Màu chữ cho cả hai nút
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartButtonText: {
        color: colors.button, // Màu chữ cho cả hai nút
        fontSize: 16,
        fontWeight: 'bold',
    },
    img: {
        width: 200,
        height: 200,
        marginLeft: -40,
    },
});

export default OrderSuccess;
