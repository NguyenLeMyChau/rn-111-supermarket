import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import React from "react";
import colors from "../../constants/Color";
import Icon from 'react-native-vector-icons/Ionicons';
import useCart from "../../hooks/useCart";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";

export default function ProductList({ route }) {
    const { name, productList } = route.params; // Nhận productList từ route.params
    const navigation = useNavigation(); // Khai báo navigation
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};

    const { addCart } = useCart();

    const handleAddCart = (productId, quantity, price) => {
        if (!user.id) {
            Alert.alert("Lưu ý", "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }
        addCart(productId, quantity, price);
    };

    const renderProduct = ({ item }) => {
        const giakhuyenmai = 0;
        const giagoc = 200000;
        return (
            <View style={styles.productContainer}>
                <Image
                    source={{ uri: item.img }}
                    style={styles.productImage}
                    resizeMode="contain"
                />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                    <Text style={styles.productUnit}>Chai</Text>
                </View>
                
                <View style={styles.sectionRow}>
                    {giakhuyenmai ? (
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.discountPrice}>{giakhuyenmai} đ</Text>
                            <Text style={styles.originalPrice}>{giagoc} đ</Text>
                        </View>
                    ) : (
                        <Text style={styles.productPrice}>{giagoc} đ</Text>
                    )}
                    <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddCart(item._id, 1, 20000)}>
                        <Icon name="cart" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderRow = ({ item }) => {
        return (
            <View style={styles.row}>
                {item.map(product => (
                    <View key={product._id} style={styles.column}>
                        {renderProduct({ item: product })}
                    </View>
                ))}
            </View>
        );
    };

    // Tạo các hàng sản phẩm
    const dataRows = [];
    for (let i = 0; i < productList.length; i += 2) {
        dataRows.push(productList.slice(i, i + 2));
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{name}</Text>
            </View>
            <FlatList
                data={dataRows}
                renderItem={renderRow}
                keyExtractor={(_, index) => index.toString()}
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
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    column: {
        width: '48%', // Chiếm gần 50% chiều rộng
    },
    productContainer: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-between',
        height: 250, // Fixed height to ensure equal spacing
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        alignSelf: 'center',
    },
    productInfo: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 5, // Điều chỉnh khoảng cách giữa productInfo và phần còn lại
    },
    productName: {
        fontSize: 13,
    },
    productUnit: {
        fontSize: 11,
        color: '#888',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#888',
        fontSize: 12,
        textAlign: 'right',
    },
    discountPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e53935',
        textAlign: 'right',
        marginTop: 10,
    },
    addToCartButton: {
        backgroundColor: colors.button,
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});