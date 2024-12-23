import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useState } from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import icon
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colors from "../../constants/Color";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../services/authRequest";
import { useAccessToken, useAxiosJWT } from "../../util/axiosInstance";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import TouchableOpacityForm from "../../components/button/TouchableOpacityForm";
import Logo from "../../components/logo/Logo";
import { getInvoicesByAccountId } from "../../services/userRequest";
import { usePaymentModal } from "../../context/PaymentProvider";

export default function User() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const { setPaymentInfo } = usePaymentModal();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};

    const guestItems = [
        { id: '4', title: 'Hỗ trợ', icon: 'question-circle' },
        { id: '5', title: 'Về Capy Smart', icon: 'info' },
    ];

    const loggedInItems = [
        { id: '1', title: 'Đơn hàng của tôi', icon: 'shopping-cart' },
        { id: '2', title: 'Thông tin tài khoản', icon: 'user' },
        ...guestItems,
    ];

    const getScreenName = (id) => {
        const screenMap = {
            '1': 'Order',
            '2': 'UserInfo',
            '3': 'Notifications',
            '4': 'Support',
            '5': 'About'
        };
        return screenMap[id]; // Lấy tên màn hình tương ứng với id
    };

    // useFocusEffect(
    //     useCallback(() => {
    //         if (user?.accessToken) {
    //             getInvoicesByAccountId(user.id, accessToken, axiosJWT, dispatch);
    //         }
    //     }, [user])
    // );

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer}
            onPress={() => navigation.navigate(getScreenName(item.id))} // Điều hướng trực tiếp dựa trên item id
        >
            <View style={{ flexDirection: 'row' }}>
                <FontAwesome name={item.icon} size={24} color="#000" style={styles.itemIcon} />
                <Text style={styles.itemText}>{item.title}</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={20} />
        </TouchableOpacity>
    );

    const handleLogout = () => {
        logoutUser(dispatch, navigation, accessToken, axiosJWT);
        setPaymentInfo(null);
    };

    return (
        <View style={styles.container}>
            {user?.accessToken ? (
                <>
                    <View style={styles.user}>
                        <Logo />

                        <View style={styles.columnText}>
                            <Text style={styles.bold}>{user.user.name}</Text>
                            <Text style={styles.nor}>Điểm tích luỹ: {user.user.loyaltyPoints}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={loggedInItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                    />
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <FontAwesome name="sign-out" size={24} color={colors.textButton} />
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                     <View style={styles.touchableContainer}>
        <Text style={styles.textBegin}>Bạn chưa đăng nhập. Vui lòng</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.touchableText}>Đăng nhập</Text>
        </TouchableOpacity>
    </View>
                    <FlatList
                        data={guestItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                    />
                </>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        justifyContent: 'space-between',
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avt: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 10,
    },
    bold: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 10
    },
    columnText: {
        flexDirection: 'column',
        flex: 1,
    },
    nor: {
        fontSize: 14,
        paddingLeft: 10
    },
    list: {
        width: '100%',
        flexGrow: 1,
        marginTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#C2C2C2',
    },
    itemIcon: {
        marginRight: 16, // Cách icon khỏi text
    },
    itemText: {
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.button,
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 20,
    },
    logoutText: {
        fontSize: 16,
        color: colors.textButton,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    touchableText: {
        fontSize: 16, 
        color: '#007BFF', 
        textDecorationLine: 'underline', 
    },
    touchableContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 10, 
    },
    textBegin: {
        fontSize: 16, 
        color: '#555', 
        marginRight: 5, 
    },
});
