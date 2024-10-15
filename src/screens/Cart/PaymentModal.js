import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import colors from '../../constants/Color';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PaymentModal({ isVisible, onClose, total }) {
    const [promoCode, setPromoCode] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [isPaymentPickerVisible, setPaymentPickerVisible] = useState(false);

    const paymentMethods = [
        { id: '1', name: 'MoMo', icon: require('../../../assets/icon-momo.png') },
        { id: '2', name: 'Thẻ tín dụng', icon: require('../../../assets/icon-the-tin-dung.png') },
        { id: '3', name: 'Ngân hàng', icon: require('../../../assets/icon-ngan-hang.jpg') },
        { id: '4', name: 'Tiền mặt', icon: require('../../../assets/icon-tien-mat.png') },
    ];

    const renderPaymentMethod = ({ item }) => (
        <TouchableOpacity style={styles.paymentMethod} onPress={() => handleSelectPaymentMethod(item)}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.paymentMethodText}>{item.name}</Text>
            {selectedPaymentMethod?.id === item.id && <Text style={styles.selectedText}>✓</Text>}
        </TouchableOpacity>
    );

    const handleSelectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
        setPaymentPickerVisible(false);
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Thanh toán</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Icon name="cancel" size={28} color={colors.button} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.sectionRow}>
                                <Text style={styles.label}>Thông tin đặt hàng</Text>
                                <TouchableOpacity style={styles.selectMethod}>
                                    <Text style={styles.selectMethodText}>Select Method</Text>
                                    <Icon name="keyboard-arrow-right" size={20} />
                                </TouchableOpacity>
                            </View>


                            <View style={styles.sectionRow}>
                                <Text style={styles.label}>Mã khuyến mãi</Text>
                                <TouchableOpacity style={styles.selectMethod}>
                                    <Text style={styles.selectMethodText}>Select Method</Text>
                                    <Icon name="keyboard-arrow-right" size={20} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.sectionRow}>
                                <Text style={styles.label}>Phương thức thanh toán</Text>
                                <TouchableOpacity style={styles.picker} onPress={() => setPaymentPickerVisible(true)}>
                                    {/* Hiển thị icon của phương thức thanh toán đã chọn */}
                                    {selectedPaymentMethod ? (
                                        <Image source={selectedPaymentMethod.icon} style={styles.icon} />
                                    ) : (
                                        <Text style={styles.pickerText}>Chọn</Text>
                                    )}
                                    <Icon name="arrow-drop-down" size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.sectionRow}>
                                <Text style={styles.label}>Tổng tiền</Text>
                                <Text style={styles.total}>{total.toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <TouchableOpacity style={styles.button} onPress={onClose}>
                                <Text style={styles.textButton}>Đặt hàng</Text>
                            </TouchableOpacity>

                            {/* Modal Picker for Payment Methods */}
                            <Modal
                                visible={isPaymentPickerVisible}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={() => setPaymentPickerVisible(false)}
                            >
                                <TouchableWithoutFeedback onPress={() => setPaymentPickerVisible(false)}>
                                    <View style={styles.modalContainer}>
                                        <TouchableWithoutFeedback>
                                            <View style={styles.pickerModalContent}>
                                                <FlatList
                                                    data={paymentMethods}
                                                    renderItem={renderPaymentMethod}
                                                    keyExtractor={item => item.id}
                                                    style={styles.paymentList}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '50%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'medium',
        marginBottom: 5,
        color: '#7C7C7C'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    paymentMethodText: {
        fontSize: 16,
        flex: 1,
    },
    picker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    pickerText: {
        fontSize: 16,
        color: '#333',
    },
    selectedText: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
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
    pickerModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '30%',
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    promoInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    selectMethod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    selectMethodText: {
        fontSize: 16,
    },
});
