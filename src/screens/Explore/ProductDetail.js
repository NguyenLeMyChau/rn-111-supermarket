import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, Animated, LayoutAnimation, UIManager, Platform, FlatList, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/Color';
import { useDispatch, useSelector } from 'react-redux';
import useCart from '../../hooks/useCart';
import { updateProductQuantity } from '../../store/reducers/cartSlice';
import { useAccessToken, useAxiosJWT } from '../../util/axiosInstance';
import { checkStockQuantityInCart } from '../../services/cartRequest';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = width * 0.42;

const ProductDetail = () => {
    const dispatch = useDispatch();
    const route = useRoute();
    const navigation = useNavigation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const { product } = route.params;
    console.log('product', product);

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const cart = useSelector((state) => state.cart?.carts);
    const products = useSelector((state) => state.product?.products) || [];

    const { addCart, updateProductToCart } = useCart();

    // Kiểm tra sản phẩm trong giỏ hàng và thiết lập số lượng
    const existingCartItem = cart?.find((item) => item.product_id === product._id);

    const [quantity, setQuantity] = useState(existingCartItem ? existingCartItem.quantity : 1);
    const [detailsVisible, setDetailsVisible] = useState(false);

    // Lọc sản phẩm liên quan
    const relatedProducts = products.filter(p => p.item_code === product.item_code && p._id !== product._id);
    if (relatedProducts.length < 7) {
        const additionalProducts = products.filter(p => p.category_id === product.category_id && p._id !== product._id && !relatedProducts.includes(p));
        relatedProducts.push(...additionalProducts.slice(0, 7 - relatedProducts.length));
    }

    // Tính giá khuyến mãi
    let giakhuyenmai = null;
    const giagoc = product.price;
    if (product.promotions) {
        product.promotions.forEach((item) => {
            if (item.type === "quantity") {
                giakhuyenmai = item.line; // Đảm bảo promo.line là một chuỗi hoặc số
            } else if (item.type === "amount") {
                giakhuyenmai = product.price - item.amount_donate; // Đảm bảo là chuỗi
            }
        });
    }
    // Cập nhật số lượng sản phẩm
    const handleUpdateQuantity = (newQuantity, total) => {
        setQuantity(newQuantity);
        dispatch(updateProductQuantity({ productId: product.id, quantity: newQuantity, total: total }));
    };

    // Giảm số lượng
    const handleDecreaseQuantity = async () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            // Gọi checkStockQuantity trước khi cập nhật
            const isStockAvailable = await checkStockQuantityInCart(product.item_code, newQuantity, accessToken, axiosJWT);
            if (isStockAvailable.inStock) {
                handleUpdateQuantity(newQuantity);
            } else {
                alert(isStockAvailable.message);
            }
        }
    };

    // Tăng số lượng
    const handleIncreaseQuantity = async () => {
        const newQuantity = quantity + 1;
        // Gọi checkStockQuantity trước khi cập nhật
        const isStockAvailable = await checkStockQuantityInCart(product.item_code, newQuantity, accessToken, axiosJWT);
        if (isStockAvailable.inStock) {
            handleUpdateQuantity(newQuantity);
        } else {
            alert(isStockAvailable.message);
        }
    };

    // Xử lý thay đổi số lượng qua TextInput
    const handleInputChange = async (text) => {
        const newQuantity = Number(text);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            // Gọi checkStockQuantity trước khi cập nhật
            const isStockAvailable = await checkStockQuantityInCart(product.item_code, newQuantity, accessToken, axiosJWT);
            if (isStockAvailable.inStock) {
                handleUpdateQuantity(newQuantity);
            } else {
                alert(isStockAvailable.message);
            }
        }
    };

    // Xử lý mở/đóng phần chi tiết sản phẩm
    const toggleDetails = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDetailsVisible(!detailsVisible);
    };

    const handleAddCart = (productId, quantity, total) => {
        if (!user.id) {
            Alert.alert("Lưu ý", "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }
        if (!existingCartItem) {
            addCart(productId, quantity, total);
        }
        else {
            updateProductToCart(productId, quantity, total);
        }
    };

    const renderProduct = ({ item }) => {
        let giakhuyenmai = null;
        const giagoc = item.price;

        if (item.promotions) {
            item.promotions.forEach((promo) => {
                if (promo.type === "quantity") {
                    giakhuyenmai = promo.line;
                } else if (promo.type === "amount") {
                    giakhuyenmai = item.price - promo.amount_donate;
                }
            });
        }

        return (
            <TouchableOpacity
                style={[styles.productContainer]}
                onPress={() => navigation.push('ProductDetail', { product: item })}
            >
                <Image source={{ uri: item.img }} style={styles.productImage} resizeMode="contain" />

                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                    <Text style={styles.productUnit}>{item.unit_id.description}</Text>
                </View>

                <View style={styles.sectionRow}>
                    {giakhuyenmai !== null ? (
                        <View style={{ flexDirection: "column" }}>
                            {typeof (giakhuyenmai) !== "string" ? (
                                <>
                                    <Text style={styles.discountPrice}>{giakhuyenmai} đ</Text>
                                    <Text style={styles.originalPrice}>{giagoc} đ</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.productPrice}>{giagoc} đ</Text>
                                    <Text style={styles.discountPrice}>{giakhuyenmai}</Text>
                                </>
                            )}
                        </View>
                    ) : (
                        <Text style={styles.productPrice}>{giagoc} đ</Text>
                    )}
                    <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddCart(item._id, 1, giakhuyenmai !== null && typeof (giakhuyenmai) !== "string" ? giakhuyenmai : giagoc)}>
                        <Ionicons name="cart" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>
                    <Text>{product.name}</Text>
                </View>
                <View style={styles.imgContainer}>
                    <Image source={{ uri: product.img }} style={styles.image} />
                </View>
                <View style={styles.info}>
                    <View style={styles.productInfo}>
                        <Text style={styles.title}>{product.name}</Text>
                        <Text style={styles.productUnit}>{product.unit_id.description}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.buttonQuantity} onPress={handleDecreaseQuantity}>
                                <Text style={styles.buttonTextQuantity}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.itemQuantity}
                                value={String(quantity)}
                                onChangeText={handleInputChange}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.buttonQuantity} onPress={handleIncreaseQuantity}>
                                <Text style={styles.buttonTextQuantity}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {giakhuyenmai !== null ? (
                                <View style={{ flexDirection: "column" }}>
                                    {typeof (giakhuyenmai) !== "string" ? (
                                        <>
                                            <Text style={styles.discountPriceAmount}>{giakhuyenmai} đ</Text>
                                            <Text style={styles.originalPrice}>{giagoc} đ</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.productPrice}>{giagoc} đ</Text>
                                            <Text style={styles.discountPrice}>{giakhuyenmai}</Text>
                                        </>
                                    )}
                                </View>
                            ) : (
                                <Text style={styles.productPrice}>{giagoc} đ</Text>
                            )}

                        </View>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5 }}>
                        <TouchableOpacity onPress={toggleDetails} style={styles.detailsButton}>
                            <Text style={styles.detailsButtonText}>Mô tả sản phẩm</Text>
                            <Icon name={detailsVisible ? 'expand-less' : 'expand-more'} size={24} color="black" />
                        </TouchableOpacity>
                        {detailsVisible && (
                            <View style={styles.detailsContainer}>
                                <Text style={styles.description}>{product.description}</Text>
                            </View>
                        )}
                    </View>


                    <View style={styles.relatedProductsContainer}>
                        <Text style={styles.relatedProductsTitle}>Sản phẩm liên quan</Text>
                        <FlatList
                            data={relatedProducts}
                            horizontal
                            keyExtractor={(item) => item._id}
                            renderItem={renderProduct}
                        />
                    </View>

                </View>
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={() => handleAddCart(product._id, quantity, giakhuyenmai !== null && typeof (giakhuyenmai) !== "string" ? giakhuyenmai : giagoc)}>
                <Text style={styles.textButton}>{existingCartItem ? 'Cập nhật giỏ hàng' : 'Thêm vào giỏ hàng'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
    },
    imgContainer: {
        width: '100%',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    info: {
        paddingHorizontal: 20,
    },
    productInfo: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
    },
    productUnit: {
        fontSize: 14,
        color: '#888',
    },
    price: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#333',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginRight: 20,
    },
    button: {
        backgroundColor: colors.button,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 20,
    },
    textButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonQuantity: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    buttonTextQuantity: {
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
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    detailsButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    detailsButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsContainer: {
        paddingVertical: 10,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right'
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#888', // Màu sắc cho giá gốc
        fontSize: 12,
        textAlign: 'right'
    },
    discountPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e53935', // Màu sắc cho giá khuyến mãi
        textAlign: 'right',
    },
    discountPriceAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e53935', // Màu sắc cho giá khuyến mãi
        textAlign: 'right',
    },

    relatedProductsContainer: {
        marginTop: 20,
    },
    relatedProductsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    relatedProductItem: {
        marginRight: 10,
        alignItems: 'center',
    },
    relatedProductImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    relatedProductName: {
        fontSize: 14,
        textAlign: 'center',
    },
    productContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        width: PRODUCT_WIDTH,
        marginRight: 15,
        height: 250,
        justifyContent: 'space-between',
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        alignSelf: 'center',
    },
    productName: {
        fontSize: 13,
    },
    productUnit: {
        fontSize: 11,
        color: '#888',
    },
    productPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left'
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#888', // Màu sắc cho giá gốc
        fontSize: 12,
        textAlign: 'left'
    },
    discountPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#e53935', // Màu sắc cho giá khuyến mãi
        textAlign: 'left',
    },
    addToCartButton: {
        backgroundColor: colors.button,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default ProductDetail;
