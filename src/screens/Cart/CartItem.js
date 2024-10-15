import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import colors from '../../constants/Color';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon

const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleRemoveItem = () => {
        // Logic để xóa mục khỏi giỏ hàng
        console.log('Remove item:', item);
    };

    return (
        <View style={styles.itemContainer}>
            <View style={{ width: '27%', height: 100 }}>
                <Image style={styles.itemImage} source={{ uri: item.img }} />
            </View>
            <View style={{ width: '50%' }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>Chai</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDecreaseQuantity}>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.itemQuantity}
                        value={String(quantity)}
                        onChangeText={(text) => setQuantity(Number(text))}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleIncreaseQuantity}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.priceContainer}>
                <TouchableOpacity onPress={handleRemoveItem}>
                    <Icon name="cancel" size={28} color={colors.button} />
                </TouchableOpacity>
                <View style={styles.priceTextContainer}>
                    <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%',
        alignSelf: 'stretch',
        height: 'auto',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E2E2',
        flexDirection: 'row',
        paddingVertical: 10
    },
    itemImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    itemName: {
        fontSize: 13,
        fontWeight: 'medium',
        width: '100%'
    },
    itemUnit: {
        fontSize: 12,
        color: '#888',
    },
    itemPrice: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    button: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.button
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
        color: colors.button
    },
    priceContainer: {
        width: '23%',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    priceTextContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -20,
    },

});

export default CartItem;
