import React from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';

const cartItems = [
    { id: '1', name: 'Sản phẩm 1', price: '100,000 VND' },
    { id: '2', name: 'Sản phẩm 2', price: '200,000 VND' },
    { id: '3', name: 'Sản phẩm 3', price: '300,000 VND' },
    { id: '4', name: 'Sản phẩm 4', price: '400,000 VND' },
    { id: '5', name: 'Sản phẩm 1', price: '100,000 VND' },
    { id: '6', name: 'Sản phẩm 2', price: '200,000 VND' },
    { id: '7', name: 'Sản phẩm 3', price: '300,000 VND' },
    { id: '8', name: 'Sản phẩm 4', price: '400,000 VND' },
];

const calculateTotal = (items) => {
    return items.reduce((total, item) => {
        const price = parseInt(item.price.replace(/,/g, '').replace(' VND', ''));
        return total + price;
    }, 0);
};

export default function Cart() {
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
    );

    const total = calculateTotal(cartItems);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ hàng</Text>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
            <View style={styles.footer}>
                <Text style={styles.total}>Tổng tiền: {total.toLocaleString('vi-VN')} VND</Text>
                <Button title="Thanh toán" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        width: '100%',
    },
    itemContainer: {
        width: '100%',
        alignSelf: 'stretch',
        height: 100,
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
        color: '#888',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});