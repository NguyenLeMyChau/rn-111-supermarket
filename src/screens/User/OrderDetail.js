import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function OrderDetail() {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params;

    // Giả sử bạn có dữ liệu chi tiết đơn hàng từ một nguồn nào đó
    const orderDetails = {
        id: orderId,
        orderNumber: 'ORD001',
        date: '2023-10-01',
        total: '500,000 VNĐ',
        status: 'Đã giao hàng',
        products: [
            {
                id: '1',
                name: 'Sản phẩm 1',
                quantity: 2,
                price: '200,000 VNĐ',
            },
            {
                id: '2',
                name: 'Sản phẩm 2',
                quantity: 1,
                price: '100,000 VNĐ',
            },
            {
                id: '3',
                name: 'Sản phẩm 3',
                quantity: 3,
                price: '200,000 VNĐ',
            },
        ],
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Chi tiết đơn hàng</Text>
            </View>

            <View style={styles.orderInfoContainer}>
                <View style={styles.orderInfoRow}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Mã đơn hàng:</Text>
                        <Text style={styles.value}>{orderDetails.orderNumber}</Text>
                    </View>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Ngày đặt hàng:</Text>
                        <Text style={styles.value}>{orderDetails.date}</Text>
                    </View>
                </View>
                <View style={styles.orderInfoRow}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Tổng tiền:</Text>
                        <Text style={styles.value}>{orderDetails.total}</Text>
                    </View>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Trạng thái:</Text>
                        <Text style={[styles.value, styles.status]}>{orderDetails.status}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.productTitle}>Sản phẩm trong đơn hàng:</Text>

            {orderDetails.products.map((item) => (
                <View key={item.id} style={styles.productContainer}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
                    <Text style={styles.productPrice}>Giá: {item.price}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
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
    orderInfoContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderInfo: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: '#777',
        marginTop: 4,
    },
    status: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
        color: '#333',
    },
    productContainer: {
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    productQuantity: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    productPrice: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
        fontWeight: '600',
    },
});
