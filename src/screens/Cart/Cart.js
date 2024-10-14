import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import TouchableOpacityForm from '../../components/button/TouchableOpacityForm';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useCommonData from '../../hooks/useCommonData';
import { loadingContainer } from '../../constants/Loading';
import Button from '../../components/button/Button';
import useCart from '../../hooks/useCart';
import colors from '../../constants/Color';

export default function Cart() {
    const navigation = useNavigation();

    const { fetchDataCart } = useCommonData();
    const { payProductInCart } = useCart();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const cart = useSelector((state) => state.cart?.carts) || [];

    const total = calculateTotal(cart);
    const [loadingCart, setLoadingCart] = useState(true);


    useFocusEffect(
        useCallback(() => {
            if (user?.accessToken) {
                fetchDataCart(setLoadingCart);
                console.log('cart', cart);
            }
        }, [user])
    );


    if (!user?.accessToken) {
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
                        {/* <Text style={styles.total}>Tổng tiền: {total.toLocaleString('vi-VN')} VND</Text> */}
                        <Button
                            TextValue='Thanh toán'
                        // onPress={() => payProductInCart(user.id, cart)}
                        />
                    </View>
                </>
            )}
        </View>
    );
}

const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={{ width: 120, height: 100 }}>
            <Image style={styles.itemImage} src={item.img} />
        </View>
        <View style={{ width: 200 }}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemUnit}>Chai</Text>

            <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.itemQuantity}>{item.quantity}</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.itemPrice} >{item.price}</Text>
        </View>
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
        height: 'auto',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',
        flexDirection: 'row',
        paddingVertical: 10
    },
    itemImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'medium',
        width: '100%'
    },
    itemUnit: {
        fontSize: 12,
        color: '#888',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    button: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 15,
        marginHorizontal: 15,
        marginVertical: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemQuantity: {
        fontSize: 16,
        color: colors.button,
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