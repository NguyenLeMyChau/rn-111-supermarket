import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon
import colors from "../../constants/Color";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../services/authRequest";
import { useAccessToken, useAxiosJWT } from "../../util/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import TouchableOpacityForm from "../../components/button/TouchableOpacityForm";

export default function User() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};

    const guestItems = [
        { id: '4', title: 'Hỗ trợ', icon: 'question-circle' },
        { id: '5', title: 'Về Capy Smart', icon: 'info' },
    ];

    const loggedInItems = [
        { id: '1', title: 'Đơn hàng của tôi', icon: 'shopping-cart' },
        { id: '2', title: 'Thông tin chi tiết', icon: 'info-circle' },
        { id: '3', title: 'Thông báo', icon: 'bell' },
        ...guestItems,
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer}>
            <Icon name={item.icon} size={24} color="#000" style={styles.itemIcon} />
            <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
    );

    const handleLogout = () => {
        logoutUser(dispatch, navigation, accessToken, axiosJWT);
    };

    return (
        <View style={styles.container}>
            {user?.user ? (
                <>
                    <View style={styles.user}>
                        <Image
                            style={styles.avt}
                            source={{ uri: user?.user?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg?gidzl=QL-ECEnPjmnbHeyrw4A_3s16W3Bo4xu5BHU2CwWUl0Wd6T4mhH2-N24LZs2h7RDU94-ADcEyCGaEvr-_3W' }}
                        />
                        <View style={styles.columnText}>
                            <Text style={styles.bold}>{user.user.name}</Text>
                            <Text style={styles.nor}>{user.user.email}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={loggedInItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                    />
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Icon name="sign-out" size={24} color={colors.textButton} />
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacityForm
                        TextBegin={"Bạn chưa đăng nhập. Vui lòng"}
                        TextValue={'Đăng nhập'}
                        onPress={() => navigation.navigate('Login')}
                    />
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
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
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
});
