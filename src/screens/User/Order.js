import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { formatCurrency, formatDate } from '../../util/format';

export default function Order() {
    const navigation = useNavigation();
    const invoices = useSelector(state => state.invoice?.invoices);

    const sortedInvoices = invoices?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const renderItem = ({ item }) => (
        console.log('item', item),
        <TouchableOpacity style={styles.orderContainer} onPress={() => navigation.navigate('OrderDetail', { itemInvoice: item })}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Mã đơn hàng: {item._id}</Text>
                {/* <Text style={styles.orderDate}>{item.date}</Text> */}
            </View>
            <Text style={styles.orderTotal}>Tổng tiền: {formatCurrency(item.paymentAmount)}</Text>
            <Text style={styles.orderTotal}>Ngày đặt hàng: {formatDate(item.createdAt)}</Text>
            <Text style={styles.orderTotal}>Phương thức thanh toán: {item.paymentMethod}</Text>
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
                data={sortedInvoices}
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