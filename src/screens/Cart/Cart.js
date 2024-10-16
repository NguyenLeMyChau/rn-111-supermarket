import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import TouchableOpacityForm from '../../components/button/TouchableOpacityForm';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import useCommonData from '../../hooks/useCommonData';
import { loadingContainer } from '../../constants/Loading';
import Button from '../../components/button/Button';
import useCart from '../../hooks/useCart';
import colors from '../../constants/Color';
import CartItem from './CartItem';
import PaymentModal from './PaymentModal';
import { usePaymentModal } from '../../context/PaymentProvider';

export default function Cart() {
    const navigation = useNavigation();

    const { isPaymentModalVisible,
        setPaymentModalVisible,
        isInPaymentProcess,
        setIsInPaymentProcess
    } = usePaymentModal();

    const { fetchDataCart } = useCommonData();
    const { payProductInCart } = useCart();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const cart = useSelector((state) => state.cart?.carts) || [];
    console.log(cart);

    const [loadingCart, setLoadingCart] = useState(true);

    // useFocusEffect(
    //     useCallback(() => {
    //         if (user?.accessToken) {
    //             fetchDataCart(setLoadingCart);
    //         }
    //     }, [user])
    // );

    useEffect(() => {
        if (user?.accessToken) {
            fetchDataCart(setLoadingCart);
        }
    }, []);

    // Lắng nghe sự kiện goBack của navigation
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isInPaymentProcess) {
                setPaymentModalVisible(true); // Mở modal thanh toán
                setIsInPaymentProcess(false); // Reset trạng thái thanh toán sau khi hiển thị modal
            }
        });

        return unsubscribe;
    }, [navigation, isInPaymentProcess]);

    const calculateTotal = (items) => {
        return items.reduce((total, item) => {
            if (typeof item.price === 'number') {
                return total + item.price;
            }
            return total;
        }, 0);
    };

    const total = calculateTotal(cart);

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
                        renderItem={({ item }) => <CartItem item={item} />}
                        keyExtractor={item => item.product_id}
                        contentContainerStyle={styles.list}
                    />
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.buttonForm} onPress={() => setPaymentModalVisible(true)}>
                            <Text style={styles.textButton}>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {/* Modal cho Thanh toán */}
            <PaymentModal
                isVisible={isPaymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                total={total}
                cart={cart}
            />
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
        textAlign: 'center',
    },
    list: {
        width: '100%',
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
    buttonForm: {
        backgroundColor: colors.button,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },

    textButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});