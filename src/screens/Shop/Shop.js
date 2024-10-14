import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import colors from "../../constants/Color";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { loadingContainer } from "../../constants/Loading";
import useCommonData from "../../hooks/useCommonData";
import Icon from 'react-native-vector-icons/Ionicons';
import useCart from "../../hooks/useCart";

export default function Shop() {
    const { fetchDataShop } = useCommonData();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const categories = useSelector((state) => state.category?.categories) || [];
    const filteredCategories = categories.filter(category => category.products.length > 0);


    const [loadingShop, setLoadingShop] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchDataShop(setLoadingShop);
        }, [])
    );

    const { addCart } = useCart();

    const handleAddCart = (productId, quantity, price) => {
        if (!user.id) {
            Alert.alert("Lưu ý", "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }
        addCart(productId, quantity, price);
    };


    const renderProduct = ({ item, index }) => {
        return (
            <View style={[styles.productContainer, index === 0 && styles.firstProduct]}>
                <Image
                    source={{ uri: item.img }}
                    style={styles.productImage}
                    resizeMode="contain"
                />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>20000đ</Text>

                <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddCart(item._id, 1, 20000)}>
                    <Icon name="cart" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        );
    };


    const renderCategory = ({ item }) => (
        <View style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <TouchableOpacity style={styles.seeMoreButton} onPress={() => alert('Xem thêm')}>
                    <Text style={styles.seeMoreText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={item.products.slice(0, 2)}
                renderItem={renderProduct}
                keyExtractor={product => product._id}
                horizontal
            />
        </View>
    );

    if (loadingShop) {
        return (
            <View style={loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cửa hàng</Text>
            <FlatList
                data={filteredCategories}
                renderItem={renderCategory}
                keyExtractor={category => category._id}
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
    },


    categoryContainer: {
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


    productContainer: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        width: 183,
        justifyContent: 'space-between',
    },
    firstProduct: {
        marginRight: 10,
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        alignSelf: 'center',
    },
    productName: {
        fontSize: 12,
        height: 80,
        marginTop: 10,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
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
});