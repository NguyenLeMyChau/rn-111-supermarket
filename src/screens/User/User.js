import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon

export default function User() {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john.doe@example.com");
    const [phone, setPhone] = useState("123-456-7890");

    const userItems = [
        { id: '1', title: 'Đơn hàng của tôi', icon: 'shopping-cart' },
        { id: '2', title: 'Thông tin chi tiết', icon: 'info-circle' },
        { id: '3', title: 'Thông báo', icon: 'bell' },
        { id: '4', title: 'Help', icon: 'question-circle' },
        { id: '5', title: 'About', icon: 'info' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer}>
            <Icon name={item.icon} size={24} color="#000" style={styles.itemIcon} />
            <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
    );

    const handleLogout = () => {
        // Thêm logic xử lý khi người dùng đăng xuất ở đây
        console.log("Đã đăng xuất");
    };

    return (
        <View style={styles.container}>
            <View style={styles.user}>
                <Image
                    style={styles.avt}
                    source={{ uri: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg?gidzl=QL-ECEnPjmnbHeyrw4A_3s16W3Bo4xu5BHU2CwWUl0Wd6T4mhH2-N24LZs2h7RDU94-ADcEyCGaEvr-_3W" }}
                />
                <View style={styles.columnText}>
                    <Text style={styles.bold}>Mỹ Châu</Text>
                    <Text style={styles.nor}>mychau@gmail.com</Text>
                </View>
            </View>
            <FlatList
                data={userItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            {/* Nút Đăng xuất ở dưới */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="sign-out" size={24} color="#fff" />
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        justifyContent: 'space-between', // Căn đều phần trên và nút dưới cùng
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
        backgroundColor: '#ff4444',
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 20,
    },
    logoutText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'bold',
    },
});
