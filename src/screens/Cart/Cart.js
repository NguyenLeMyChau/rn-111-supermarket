import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import TouchableOpacityForm from '../../components/button/TouchableOpacityForm';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useCommonData from '../../hooks/useCommonData';
import { loadingContainer } from '../../constants/Loading';

export default function Cart() {
    const navigation = useNavigation();

    const { fetchDataCart } = useCommonData();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const cart = useSelector((state) => state.cart?.carts) || [];
    console.log(cart);

    const total = calculateTotal(cart);
    const [loadingCart, setLoadingCart] = useState(true);


    useFocusEffect(
        useCallback(() => {
            fetchDataCart(setLoadingCart);
        }, [])
    );


    if (!user.user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Giỏ hàng</Text>
                <TouchableOpacityForm
                    TextBegin={"Bạn chưa đăng nhập. Vui lòng"}
                    TextValue={'Đăng nhập'}
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        );
    }

    if (loadingCart) {
        return (
            <View style={loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ hàng</Text>
            {cart.length === 0 ? (
                <Text style={styles.emptyCartText}>Không có sản phẩm nào trong giỏ hàng</Text>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        renderItem={renderItem}
                        keyExtractor={item => item.product_id}
                        contentContainerStyle={styles.list}
                    />
                    <View style={styles.footer}>
                        <Text style={styles.total}>Tổng tiền: {total.toLocaleString('vi-VN')} VND</Text>
                        <Button title="Thanh toán" />
                    </View>
                </>
            )}
        </View>
    );
}

const renderItem = ({ item }) => (
    console.log('item:', item),
    <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.quantity}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
);

const calculateTotal = (items) => {
    return items.reduce((total, item) => {
        if (typeof item.price === 'number') {
            return total + item.price;
        }
        return total;
    }, 0);
};


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
    emptyCartText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});