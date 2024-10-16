import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import colors from '../../constants/Color';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import { useDispatch, useSelector } from 'react-redux'; // Import dispatch from Redux
import { updateProductQuantity } from '../../store/reducers/cartSlice';
import { removeProductCart } from '../../services/cartRequest';
import { useAccessToken, useAxiosJWT } from '../../util/axiosInstance';
import useCommonData from '../../hooks/useCommonData';
import { loadingContainer } from '../../constants/Loading';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const { fetchDataCart } = useCommonData();

    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const [quantity, setQuantity] = useState(item.quantity);
    const [loadingCart, setLoadingCart] = useState(false);

    const giakhuyenmai = 0;
    const giagoc = 40000;

    // Cập nhật số lượng sản phẩm
    const handleUpdateQuantity = (newQuantity) => {
        setQuantity(newQuantity);
        dispatch(updateProductQuantity({ productId: item.product_id, quantity: newQuantity }));
    };

    // Giảm số lượng
    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            handleUpdateQuantity(newQuantity);
        }
    };

    // Tăng số lượng
    const handleIncreaseQuantity = () => {
        const newQuantity = quantity + 1;
        handleUpdateQuantity(newQuantity);
    };

    // Xử lý thay đổi số lượng qua TextInput
    const handleInputChange = (text) => {
        const newQuantity = Number(text);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            handleUpdateQuantity(newQuantity);
        }
    };

    const handleRemoveItem = async () => {
        // Logic để xóa mục khỏi giỏ hàng
        console.log('Remove item:', item);
        await removeProductCart(user.id, item.product_id, accessToken, axiosJWT);
        await fetchDataCart(setLoadingCart);
    };

    return (
        <View style={styles.itemContainer}>
            <View style={{ width: '27%', height: 100 }}>
                <Image style={styles.itemImage} source={{ uri: item.img }} />
            </View>
            <View style={{ width: '50%' }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>Chai</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDecreaseQuantity}>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.itemQuantity}
                        value={String(quantity)}
                        onChangeText={handleInputChange}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleIncreaseQuantity}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.priceContainer}>
                {loadingCart ? (
                    <View style={loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )
                    :
                    (
                        <TouchableOpacity onPress={() => handleRemoveItem()} style={styles.buttonRemove}>
                            <Icon name="cancel" size={28} color={colors.button} />
                        </TouchableOpacity>
                    )
                }
                <View style={styles.priceTextContainer}>
                    {giakhuyenmai ? (
                        <View>
                            <Text style={styles.itemDiscountPrice}>
                                {giakhuyenmai.toLocaleString('vi-VN')} đ
                            </Text>
                            <Text style={styles.itemOriginalPrice}>
                                {giagoc.toLocaleString('vi-VN')} đ
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.itemPrice}>
                            {giagoc.toLocaleString('vi-VN')} đ
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%',
        alignSelf: 'stretch',
        height: 'auto',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    itemImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    itemName: {
        fontSize: 13,
        fontWeight: 'medium',
        width: '100%',
    },
    itemUnit: {
        fontSize: 12,
        color: '#888',
    },
    itemOriginalPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: '#888',
        textAlign: 'right',
    },
    itemDiscountPrice: {
        fontSize: 13,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'right',
    },
    itemPrice: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    button: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.button,
    },
    itemQuantity: {
        width: 50,
        height: 40,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',
        marginHorizontal: 8,
        color: colors.button,
    },
    priceContainer: {
        width: '23%',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    priceTextContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -20,
    },
    buttonRemove: {
        width: 40,
        height: 40,
        alignItems: 'flex-end',
    }
});

export default CartItem;
