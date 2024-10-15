import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import tinycolor from 'tinycolor2';
import Input from '../../components/input/Input';
import { useSelector } from 'react-redux';
import colors from '../../constants/Color';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = width * 0.42;

export default function Explore() {
    const navigation = useNavigation();
    const categories = useSelector((state) => state.category?.categories) || [];

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                    navigation.navigate('ProductList', { name: item.name, productList: item.products });
                }}
            >
                <Image source={{ uri: item.img }} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Loại sản phẩm</Text>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                numColumns={2}
                key={(2).toString()}
            />
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
    list: {
        width: '100%',
    },
    itemContainer: {
        width: PRODUCT_WIDTH,
        height: 150,
        marginTop: 16,
        marginRight: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.button,
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
    },
});