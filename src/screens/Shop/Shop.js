import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import colors from "../../constants/Color";

const initialCategories = [
    {
        id: '1',
        name: 'Loại 1',
        products: [
            { id: '1', name: 'Sản phẩm 1' },
            { id: '2', name: 'Sản phẩm 2' },
            { id: '3', name: 'Sản phẩm 3' },
            { id: '4', name: 'Sản phẩm 4' },
            { id: '5', name: 'Sản phẩm 5' },
        ],
    },
    {
        id: '2',
        name: 'Loại 2',
        products: [
            { id: '6', name: 'Sản phẩm 6' },
            { id: '7', name: 'Sản phẩm 7' },
            { id: '8', name: 'Sản phẩm 8' },
            { id: '9', name: 'Sản phẩm 9' },
            { id: '10', name: 'Sản phẩm 10' },
        ],
    },
];

export default function Shop() {
    const [categories, setCategories] = useState(initialCategories);

    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
        </View>
    );

    const renderCategory = ({ item }) => (
        <View style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <TouchableOpacity style={styles.seeMoreButton} onPress={() => alert('Xem thêm sản phẩm')}>
                    <Text style={styles.seeMoreText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={item.products.slice(0, 3)}
                renderItem={renderProduct}
                keyExtractor={product => product.id}
                horizontal
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cửa hàng</Text>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={category => category.id}
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
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 16,
    },
    productName: {
        fontSize: 16,
    },
    seeMoreButton: {
        padding: 4,

    },
    seeMoreText: {
        color: colors.button,
        fontSize: 12,
    },
});