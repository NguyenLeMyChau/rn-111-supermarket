import React from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import colors from '../../constants/Color';

const ProductDetail = () => {
    const route = useRoute();
    const navigation = useNavigation(); // Hook để điều hướng
    const { product } = route.params;
    const giagoc = 200000;

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                    <Text style={styles.productUnit}>Chai</Text>
                </View>
                <Text style={styles.price}>{giagoc.toLocaleString('vi-VN')} VNĐ</Text>
                <Text style={styles.description}>{product.description}</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.textButton}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        fontSize: 20,
        color: '#FF6347',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
    },
    button: {
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

export default ProductDetail;
