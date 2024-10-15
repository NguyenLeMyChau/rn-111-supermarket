import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Order() {
    const navigation = useNavigation();

    // Giả sử bạn có dữ liệu đơn hàng từ một nguồn nào đó
    const orders = [
        {
            id: '1',
            orderNumber: 'ORD001',
            date: '2023-10-01',
            total: '500,000 VNĐ',
            status: 'Đã giao hàng',
        },
        {
            id: '2',
            orderNumber: 'ORD002',
            date: '2023-10-05',
            total: '300,000 VNĐ',
            status: 'Đang xử lý',
        },
        {
            id: '3',
            orderNumber: 'ORD003',
            date: '2023-10-10',
            total: '700,000 VNĐ',
            status: 'Đã hủy',
        },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.orderContainer} onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Mã đơn hàng: {item.orderNumber}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
            </View>
            <Text style={styles.orderTotal}>Tổng tiền: {item.total}</Text>
            <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Đơn hàng của bạn</Text>
            </View>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        marginRight: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
    },
    list: {
        paddingBottom: 16,
    },
    orderContainer: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderDate: {
        fontSize: 14,
        color: '#888',
    },
    orderTotal: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    orderStatus: {
        fontSize: 14,
        color: '#555',
    },
});