import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatCurrency, formatDate } from '../../util/format';

export default function OrderDetail() {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemInvoice } = route.params;
    console.log('itemInvoice', itemInvoice);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Chi tiết đơn hàng</Text>
            </View>

            <View style={styles.orderInfoContainer}>
                <View style={styles.orderInfoRow}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Người nhận:</Text>
                        <Text style={styles.value}>{itemInvoice.paymentInfo.name}</Text>
                    </View>

                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Số điện thoại:</Text>
                        <Text style={styles.value}>{itemInvoice.paymentInfo.phone}</Text>
                    </View>

                </View>
                <View style={styles.orderInfoRow}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Tổng tiền:</Text>
                        <Text style={{...styles.value, fontWeight: 'bold'}}>{formatCurrency(itemInvoice.paymentAmount)}</Text>
                    </View>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Ngày đặt hàng:</Text>
                        <Text style={styles.value}>{formatDate(itemInvoice.createdAt)}</Text>
                    </View>
                </View>

                <View style={styles.orderInfoRow}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.label}>Địa chỉ nhận:</Text>
                        <Text style={styles.value}>
                            {`${itemInvoice.paymentInfo.address.street}, ${itemInvoice.paymentInfo.address.ward}, ${itemInvoice.paymentInfo.address.district}, ${itemInvoice.paymentInfo.address.city}`}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={styles.productTitle}>Sản phẩm trong đơn hàng:</Text>

            {itemInvoice.detail.map((item) => (
                <View key={item.id} style={styles.productContainer}>
                    <Image source={{ uri: item.productImg }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{item.productName}</Text>
                        <Text style={styles.productQuantity}>Đơn vị tính: {item.unitName}</Text>
                        <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
                        <Text style={styles.productPrice}>Giá: {formatCurrency(item.price)}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 8,
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
    },
    orderInfoContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderInfo: {
        flex: 1,
    },
    orderInfoRow2: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 12
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 8,
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: '#777',
    },
    status: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
        color: '#333',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productQuantity: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
