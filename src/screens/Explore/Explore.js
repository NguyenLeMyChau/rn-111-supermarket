import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import tinycolor from 'tinycolor2';
import Input from '../../components/input/Input';
import { useSelector } from 'react-redux';
import colors from '../../constants/Color';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = width * 0.4;

export default function Explore() {
    const navigation = useNavigation();
    const categories = useSelector((state) => state.category?.categories) || [];

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                    navigation.navigate('ProductList', { name: item.category.name, productList: item.products });
                }}
            >
                <Image source={{ uri: item.category?.img }} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.category?.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Loại sản phẩm</Text>
            <View style={styles.listContainer}>
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={item => item.category._id}
                    numColumns={2}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    listContainer: {
        flex: 1,  // Ensure this view takes up the available space
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {
        width: PRODUCT_WIDTH,
        height: 170,
        marginTop: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.button,
        marginHorizontal: 8,
    },
    itemImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});