import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency, formatDate } from '../../util/format';
import useUser from '../../hooks/useUser';

export default function OrderStatusTab({ route, navigation }) {
    const { status } = route.params;  // Lấy trạng thái đơn hàng từ params
    console.log('status', status);
    const invoices = useSelector(state => state.invoice?.invoices);
    console.log('invoices', invoices);
    const dispatch = useDispatch();
    const { updateStatusOrderUser } = useUser();  // Sử dụng custom hook useUser

    // Lọc các đơn hàng theo trạng thái
    const filteredInvoices = invoices?.filter(item => item.status === status);

    const handleConfirmDelivery = (invoice) => {
        // Xác nhận và thay đổi trạng thái đơn hàng
        if (Platform.OS === 'web') {
            const confirmed = window.confirm('Xác nhận "Đã giao hàng"?');
            if (confirmed) {
                // Dispatch action để cập nhật trạng thái đơn hàng
                console.log('call API to update status of invoice', invoice);
                updateStatusOrderUser(invoice._id, 'Đã nhận hàng');

            }
        } else {
            Alert.alert(
                'Xác nhận đã giao hàng',
                'Xác nhận "Đã giao hàng"?',
                [
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                    {
                        text: 'Xác nhận',
                        onPress: () => {
                            // Dispatch action để cập nhật trạng thái đơn hàng
                            console.log('call API to update status of invoice', invoice);
                            updateStatusOrderUser(invoice._id, 'Đã nhận hàng');
                        },
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.orderContainer}
            onPress={() => navigation.navigate('OrderDetail', { itemInvoice: item })}  // Sử dụng navigation ở đây
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Mã đơn hàng: {item.invoiceCode}</Text>
                <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            </View>
            <Text style={styles.orderTotal}>Tổng tiền: {formatCurrency(item.paymentAmount)}</Text>
            <Text style={styles.orderTotal}>Phương thức thanh toán: {item.paymentMethod}</Text>

            {/* Nếu trạng thái là "Đang giao hàng", hiển thị nút xác nhận đã giao hàng */}
            {item.status === 'Đang giao hàng' && (
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleConfirmDelivery(item)}
                >
                    <Text style={styles.confirmButtonText}>Xác nhận đã giao hàng</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredInvoices}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
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
    list: {
        paddingBottom: 16,
    },
    orderContainer: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderDate: {
        fontSize: 14,
        color: '#888',
    },
    orderTotal: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    confirmButton: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#009ED8',
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});