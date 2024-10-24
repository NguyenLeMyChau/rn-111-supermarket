import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Input from "../../components/input/Input";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Search() {
    const navigation = useNavigation();
    const products = useSelector((state) => state.product?.products) || [];

    const [searchTerm, setSearchTerm] = useState("");

    // Hàm để lọc sản phẩm
    const filteredProducts = products.filter(product => {
        const name = product.name.toLowerCase().trim();
        const description = product.unit_id.description.toLowerCase().trim();
        const searchWords = searchTerm.toLowerCase().trim().split(" "); // Tách từ khóa thành mảng các từ

        // Kiểm tra xem tất cả các từ trong searchWords có trong tên sản phẩm hoặc mô tả đơn vị không
        return searchWords.every(word => name.includes(word) || description.includes(word));
    });

    return (
        <View style={styles.outerContainer}>
            <Input
                placeholder="Tìm kiếm sản phẩm"
                Icon={EvilIcons}
                nameIcon="search"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            {searchTerm ? (
                <View style={styles.container}>
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.itemContainer}
                                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                            >
                                <Image source={{ uri: item.img }} style={styles.productImage} />
                                <Text style={styles.productName}>
                                    {item.name} - {item.unit_id.description}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: 'white',
    },
    container: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
    },
    itemContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    productImage: {
        width: 35,
        height: 35,
        borderRadius: 8,
        marginRight: 10,
    },
    productName: {
        fontSize: 14,
        marginBottom: 4,
    },
});
