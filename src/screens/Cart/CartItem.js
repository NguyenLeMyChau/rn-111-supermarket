import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import colors from '../../constants/Color';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import { useDispatch, useSelector } from 'react-redux'; // Import dispatch from Redux
import { updateProductQuantity } from '../../store/reducers/cartSlice';
import { getPromotionByProductId, removeProductCart } from '../../services/cartRequest';
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
    const [giakhuyenmai, setGiaKhuyeMai] = useState();
    const [khuyenMai, setKhuyenMai] = useState('');
    const [type, setType] = useState('');
    const [giaBan, setGiaBan] = useState(item.quantity * item.price);

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const promotions = await getPromotionByProductId(item.product_id);
                if (promotions?.length > 0) {
                    const promotion = promotions[0];
                    setKhuyenMai(promotion); // Giả sử chỉ sử dụng khuyến mãi đầu tiên tìm thấyi
                    if (promotion.promotionLine_id.type === 'amount') {
                        setGiaKhuyeMai((item.price - promotion.amount_donate) * quantity);
                        setType(promotion.promotionLine_id.type)
                    } else if (promotion.promotionLine_id.type === 'quantity') {
                        setType(promotion.promotionLine_id.type)
                        if (quantity / (promotion.quantity + promotion.quantity_donate) | 0 > 0) {
                            setGiaKhuyeMai((quantity - promotion.quantity_donate) * item.price);
                        }
                    }

                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin khuyến mãi:', error);
            }
        };

        fetchPromotion();
    }, [item.product_id, quantity]);

    // Cập nhật số lượng sản phẩm
    const handleUpdateQuantity = async (newQuantity) => {
        setQuantity(newQuantity);
        setGiaBan(newQuantity * item.price);

        // Tính lại giá khuyến mãi
        let updatedGiaKhuyenMai = null;
        if (khuyenMai) {
            // Giả sử bạn đã có thông tin khuyến mãi, tính toán lại giá khuyến mãi
            if (type === 'amount') {
                updatedGiaKhuyenMai = (item.price - khuyenMai.amount_donate) * newQuantity;
            } else if (type === 'quantity') {
                let quantity_donate = newQuantity / (khuyenMai.quantity + khuyenMai.quantity_donate) | 0
                if (quantity_donate > 0) {
                    updatedGiaKhuyenMai = (newQuantity - khuyenMai.quantity_donate * quantity_donate) * item.price;
                }
            }
            setGiaKhuyeMai(updatedGiaKhuyenMai);
        }

        // Dispatch cập nhật giỏ hàng với giá trị mới
        dispatch(updateProductQuantity({
            productId: item.product_id,
            quantity: newQuantity,
            total: updatedGiaKhuyenMai ? updatedGiaKhuyenMai : newQuantity * item.price
        }));
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
        await removeProductCart(user.id, item.product_id, accessToken, axiosJWT);
        await fetchDataCart(setLoadingCart);
    };

    return (
        <View style={styles.itemContainer}>
            <View style={{ width: '28%', height: 100, paddingRight: 10 }}>
                <Image style={styles.itemImage} source={{ uri: item.img }} />
            </View>
            <View style={{ width: '45%' }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>{item.unit.description}</Text>
                {khuyenMai && <Text style={styles.itemPromotion}>{khuyenMai.promotionLine_id.description}</Text>}

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
                                {giaBan.toLocaleString('vi-VN')} đ
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.itemPrice}>
                            {giaBan.toLocaleString('vi-VN')} đ
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
        fontSize: 14,
        fontWeight: 'medium',
        width: '100%',
    },
    itemUnit: {
        fontSize: 13,
        color: '#888',
    },
    itemPromotion: {
        color: 'red',
        fontSize: 14,
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
