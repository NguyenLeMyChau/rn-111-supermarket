import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert, Dimensions, TextInput } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import colors from "../../constants/Color";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { loadingContainer } from "../../constants/Loading";
import useCommonData from "../../hooks/useCommonData";
import Icon from 'react-native-vector-icons/Ionicons';
import useCart from "../../hooks/useCart";
import Logo from '../../components/logo/Logo';
import Search from "./Search";

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = width * 0.42;

export default function Shop() {
    const navigation = useNavigation();
    const { fetchDataShop } = useCommonData();
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const categories = useSelector((state) => state.category?.categories) || [];
    const products = useSelector((state) => state.product?.products) || [];
    const productsWithPromotions = products.filter(product => product.promotions && product.promotions.length > 0);

    const filteredCategories = categories.filter(category => category.products.length > 0);
    const [loadingShop, setLoadingShop] = useState(true);

    // useEffect to fetch shop data
    useEffect(() => {
        fetchDataShop(setLoadingShop);
    }, []);

    const { addCart } = useCart();

    const handleAddCart = (productId, quantity, price) => {
        console.log('user', user)
        if (!user || Object.keys(user).length === 0) {
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }
        addCart(productId, quantity, price);
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
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
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
                        <Icon name="cart" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderCategory = ({ item }) => (
        <View style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{item.category?.name}</Text>
                <TouchableOpacity
                    style={styles.seeMoreButton}
                    onPress={() => navigation.navigate('ProductList', { name: item.category.name, productList: item.products })}
                >
                    <Text style={styles.seeMoreText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                <FlatList
                    data={item.products.slice(0, 2)}
                    renderItem={renderProduct}
                    keyExtractor={product => product._id}
                    horizontal
                />
            </View>
        </View>
    );

    // Combine "Khuyến mãi" and categories into one list
    const combinedData = [
        { type: 'promotion', products: productsWithPromotions },
        ...filteredCategories.map(category => ({ type: 'category', ...category }))
    ];

    const renderCombinedItem = ({ item }) => {
        if (item.type === 'promotion') {
            return (
                <View style={{ ...styles.promotionContainer, marginBottom: 20 }}>
                    <View style={styles.categoryHeader}>
                        <Text style={styles.categoryName}>Khuyến mãi</Text>
                        <TouchableOpacity
                            style={styles.seeMoreButton}
                            onPress={() => navigation.navigate('ProductList', { name: 'Khuyến mãi', productList: item.products })}
                        >
                            <Text style={styles.seeMoreText}>Xem thêm</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listContainer}>

                        <FlatList
                            data={item.products}
                            renderItem={renderProduct}
                            keyExtractor={product => product._id}
                            horizontal
                        />
                    </View>
                </View>
            );
        }
        return renderCategory({ item });
    };

    if (loadingShop) {
        return (
            <View style={loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>CAPY SMART</Text>
                <Logo width={50} height={50} />
            </View>

            <Search />

            {/* FlatList to render combined "Khuyến mãi" and categories */}
            <FlatList
                data={combinedData}
                renderItem={renderCombinedItem}
                keyExtractor={(item, index) => index.toString()}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.primary
    },
    categoryContainer: {
        flex: 1,
        marginBottom: 24,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        width: PRODUCT_WIDTH,
        marginHorizontal: 15,
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
    productInfo: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 5,
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
    seeMoreButton: {
        padding: 4,
    },
    seeMoreText: {
        color: colors.button,
        fontSize: 12,
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
