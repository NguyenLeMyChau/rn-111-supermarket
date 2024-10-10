// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../constants/Color';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import Shop from '../screens/Shop/Shop';
import Explore from '../screens/Explore/Explore';
import Cart from '../screens/Cart/Cart';
import User from '../screens/User/User';
import QRCodeScanner from '../screens/QRCodeScanner/QRCodeScanner';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Shop') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Explore') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'User') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'QRCodeScanner') {
                        iconName = focused ? 'qr-code' : 'qr-code-outline';
                        iconSize = focused ? size + 10 : size;
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 0,
                    elevation: 10,
                    height: 60,
                    paddingBottom: 10,
                    borderTopLeftRadius: 10,
                    borderTopEndRadius: 10,
                },
            })}
        >
            <Tab.Screen name="Shop" component={Shop} options={{ tabBarLabel: 'Cửa hàng' }} />
            <Tab.Screen name="Explore" component={Explore} options={{ tabBarLabel: 'Khám phá' }} />
            <Tab.Screen name="QRCodeScanner" component={QRCodeScanner} options={{ tabBarLabel: 'Quét QR' }} />
            <Tab.Screen name="Cart" component={Cart} options={{ tabBarLabel: 'Giỏ hàng' }} />
            <Tab.Screen name="User" component={User} options={{ tabBarLabel: 'Người dùng' }} />
        </Tab.Navigator>
    );
}

export default function AppRouter() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
