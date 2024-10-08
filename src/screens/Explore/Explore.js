import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import tinycolor from 'tinycolor2';
import Input from '../../components/input/Input';

const productCategories = [
    { id: '1', name: 'Dầu ăn', color: '#FDE598' },
    { id: '2', name: 'Thịt và Cá', color: '#F7A593' },
    { id: '3', name: 'Snack', color: '#D3B0E0' },
    { id: '4', name: 'Đồ uống', color: '#B7DFF5' },
    { id: '5', name: 'Dầu ăn', color: '#FDE598' },
    { id: '6', name: 'Thịt và Cá', color: '#F7A593' },
    { id: '7', name: 'Snack', color: '#D3B0E0' },
    { id: '8', name: 'Đồ uống', color: '#B7DFF5' },
];

export default function Explore() {
    const renderItem = ({ item }) => {
        const backgroundColor = tinycolor(item.color).lighten(15).toString();
        const borderColor = tinycolor(item.color).darken(0).toString();

        return (
            <View style={[styles.itemContainer, { backgroundColor, borderColor }]}>
                <Text style={[styles.itemText]}>{item.name}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tìm sản phẩm</Text>
            <FlatList
                data={productCategories}
                renderItem={renderItem}
                keyExtractor={item => item.id}
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
    },
    list: {
        width: '100%',
    },
    itemContainer: {
        width: 175,
        height: 190,
        marginTop: 16,
        marginRight: 28,
        borderWidth: 2,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});