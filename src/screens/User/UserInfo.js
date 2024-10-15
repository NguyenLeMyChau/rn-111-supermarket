import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function UserInfo() {
    const navigation = useNavigation();

    // Giả sử bạn có dữ liệu khách hàng từ một nguồn nào đó
    const customerInfo = {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123 456 789',
        address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Thông tin khách hàng</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Tên:</Text>
                <Text style={styles.value}>{customerInfo.name}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{customerInfo.email}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Số điện thoại:</Text>
                <Text style={styles.value}>{customerInfo.phone}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={styles.value}>{customerInfo.address}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditUserInfo')}>
                <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        marginRight: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
    },
    infoContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    value: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    editButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});