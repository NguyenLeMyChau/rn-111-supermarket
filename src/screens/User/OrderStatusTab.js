import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Platform, Alert, Modal, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency, formatDate } from '../../util/format';
import useUser from '../../hooks/useUser';
import { useSocket } from '../../context/SocketContext';
import { updateInvoiceStatus } from '../../store/reducers/invoiceSlice';
import { getInvoicesByInvoiceCode } from '../../services/userRequest';
import { TextInput } from 'react-native';

export default function OrderStatusTab({ route, navigation }) {
    const { status } = route.params;  // Lấy trạng thái đơn hàng từ params
    console.log('status', status);
    const invoices = useSelector(state => state.invoice?.invoices);
    console.log('invoices', invoices);
    const dispatch = useDispatch();
    const { updateStatusOrderUser } = useUser();  // Sử dụng custom hook useUser
    const { emitSocketEvent, onSocketEvent } = useSocket();
    const [modalVisible, setModalVisible] = useState(false); // Quản lý trạng thái hiển thị modal
    const [reason, setReason] = useState(''); // Lý do hoàn trả
    const [selectedInvoice, setSelectedInvoice] = useState(null); // Đơn hàng được chọn

    useEffect(() => {
        const handleNewInvoice = async (data) => {
            const { invoice } = data;
            console.log(invoice);

            try {

                // Fetch the full invoice data by invoiceCode
                await getInvoicesByInvoiceCode(dispatch, invoice);

            } catch (error) {

            }
        };


        const handleUpdateStatus = async (data) => {
            const { invoiceCode, status } = data;
            console.log('Status Update:', invoiceCode, status);


            // Dispatch action to update the invoice status in Redux store
            dispatch(updateInvoiceStatus({ invoiceCode: invoiceCode, status: status }))

        };

        // Subscribe to 'newInvoice' and 'updateStatus' events
        onSocketEvent('newInvoice', handleNewInvoice);
        onSocketEvent('updateStatus', handleUpdateStatus);

    }, [onSocketEvent, dispatch]);

    // Lọc và sắp xếp các đơn hàng theo trạng thái và ngày tạo từ mới nhất đến cũ nhất
    const filteredInvoices = invoices
        ?.filter(item => item.status === status)
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleConfirmDelivery = (invoice) => {
        // Xác nhận và thay đổi trạng thái đơn hàng
        if (Platform.OS === 'web') {
            const confirmed = window.confirm('Xác nhận "Đã giao hàng"?');
            if (confirmed) {
                // Dispatch action để cập nhật trạng thái đơn hàng
                console.log('call API to update status of invoice', invoice);
                updateStatusOrderUser(invoice, 'Đã nhận hàng', null, emitSocketEvent);

            }
        } else {
            Alert.alert(
                'Xác nhận đã giao hàng', // Title of the alert
                'Xác nhận "Đã giao hàng"?', // Message in the alert
                [
                    {
                        text: 'Hủy', // Cancel button text
                        style: 'cancel', // Cancel button style
                    },
                    {
                        text: 'Xác nhận', // Confirm button text
                        onPress: () => {
                            updateStatusOrderUser(invoice, 'Đã nhận hàng', null, emitSocketEvent);
                        },

                    },
                ],
                { cancelable: true } // Allows dismissing the alert by tapping outside
            );
        }
    };
    // const handleRequestReturn = (invoice) => {
    //     // Xác nhận và thay đổi trạng thái đơn hàng
    //     if (Platform.OS === 'web') {
    //         const confirmed = window.confirm('Yêu cầu hoàn trả');
    //         if (confirmed) {
    //             // Dispatch action để cập nhật trạng thái đơn hàng
    //             console.log('call API to update status of invoice', invoice);
    //             updateStatusOrderUser(invoice, 'Yêu cầu hoàn trả', reason, emitSocketEvent);

    //         }
    //     } else {
    //         Alert.alert(
    //             'Xác nhận Yêu cầu hoàn trả', // Title of the alert
    //             'Xác nhận "Yêu cầu hoàn trả"?', // Message in the alert
    //             [
    //                 {
    //                     text: 'Hủy', // Cancel button text
    //                     style: 'cancel', // Cancel button style
    //                 },
    //                 {
    //                     text: 'Xác nhận', // Confirm button text
    //                     onPress: () => {
    //                         updateStatusOrderUser(invoice, 'Yêu cầu hoàn trả', reason, emitSocketEvent);
    //                     },

    //                 },
    //             ],
    //             { cancelable: true } // Allows dismissing the alert by tapping outside
    //         );
    //     }
    // };

    const handleConfirmReturn = () => {
        if (!reason.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập lý do hoàn trả.');
            return;
        }

        Alert.alert(
            'Xác nhận Yêu cầu hoàn trả', // Title of the alert
            'Xác nhận "Yêu cầu hoàn trả"?', // Message in the alert
            [
                {
                    text: 'Hủy', // Cancel button text
                    style: 'cancel', // Cancel button style
                },
                {
                    text: 'Xác nhận', // Confirm button text
                    onPress: () => {
                        updateStatusOrderUser(selectedInvoice, 'Yêu cầu hoàn trả', reason, emitSocketEvent);
                        setReason('');
                        setModalVisible(false); // Ẩn modal sau khi xử lý
                    },

                },
            ],
            { cancelable: true } // Allows dismissing the alert by tapping outside
        );
    };

    const handleRequestReturn = (invoice) => {
        setSelectedInvoice(invoice); // Lưu thông tin đơn hàng được chọn
        setModalVisible(true); // Hiển thị modal
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
                <>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => handleConfirmDelivery(item)}
                    >
                        <Text style={styles.confirmButtonText}>Xác nhận đã nhận hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.returnButton}
                        onPress={() => handleRequestReturn(item)}
                    >
                        <Text style={styles.returnButtonText}>Yêu cầu hoàn trả</Text>
                    </TouchableOpacity>
                </>
            )}
            {item.status === 'Yêu cầu hoàn trả' && (
                <>
                    <Text style={styles.returnText}>Yêu cầu hoàn trả</Text>
                </>
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

            {/* Modal nhập lý do hoàn trả */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nhập lý do hoàn trả</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập lý do..."
                            value={reason}
                            onChangeText={setReason}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Hủy" onPress={() => setModalVisible(false)} />
                            <Button title="Xác nhận" onPress={handleConfirmReturn} />
                        </View>
                    </View>
                </View>
            </Modal>
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
        width: '50%',
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
    returnButton: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#FF6347',
        borderRadius: 8,
        alignItems: 'center',
    },
    returnButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    returnText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    returnButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});