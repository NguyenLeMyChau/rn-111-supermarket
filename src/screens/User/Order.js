import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import OrderStatusTab from './OrderStatusTab'; // Component hiển thị đơn hàng theo trạng thái
import Icon from 'react-native-vector-icons/Ionicons'; // Đảm bảo bạn đã cài đặt react-native-vector-icons
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons' // Import MaterialIcons

const Tab = createBottomTabNavigator();

export default function Order({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Đơn hàng của bạn</Text>
            </View>

            {/* Bottom Tab Navigator */}
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontSize: 12 },
                    tabBarItemStyle: { width: 100 },
                    tabBarActiveTintColor: '#009ED8', // Màu chữ khi tab được chọn
                    tabBarInactiveTintColor: 'gray', // Màu chữ khi tab không được chọn
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Chờ xử lý"
                    component={OrderStatusTab}
                    initialParams={{ status: 'Chờ xử lý' }}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="pending" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Chuẩn bị hàng"
                    component={OrderStatusTab}
                    initialParams={{ status: 'Chuẩn bị hàng' }}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="directions-run" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Đang giao hàng"
                    component={OrderStatusTab}
                    initialParams={{ status: 'Đang giao hàng' }}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="local-shipping" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Đã nhận hàng"
                    component={OrderStatusTab}
                    initialParams={{ status: 'Đã nhận hàng' }}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="check-circle" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Yêu cầu hoàn trả"
                    component={OrderStatusTab}
                    initialParams={{ status: 'Yêu cầu hoàn trả' }}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="cash-refund" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
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
});
