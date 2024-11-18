import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, Modal, Dimensions } from 'react-native';
import colors from '../../constants/Color';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';

import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import TouchableOpacityForm from '../../components/button/TouchableOpacityForm';
import { registerCustomer } from '../../services/authRequest';

const CELL_COUNT = 6;
const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.8;
const CELL_WIDTH = BUTTON_WIDTH / CELL_COUNT;

export default function Register({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !phone || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
            console.log('Vui lòng nhập đầy đủ thông tin');
        } else {
            const registerData = {
                name,
                phone,
                password,
                role: 'customer',
            };
            await registerCustomer(registerData);
        }
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>ĐĂNG KÝ</Text>

            <Input
                Icon={AntDesign}
                nameIcon={'user'}
                placeholder={'Nhập tên'}
                value={name}
                onChangeText={setName}
            />

            <Input
                Icon={Fontisto}
                nameIcon={'phone'}
                placeholder={'Số điện thoại'}
                value={phone}
                onChangeText={setPhone}
            />

            <Input
                Icon={AntDesign}
                nameIcon={'lock'}
                placeholder={'Mật khẩu'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                IconEnd={Feather}
                nameIconEnd={showPassword ? 'eye' : 'eye-off'}
                onPressIconEnd={() => setShowPassword(!showPassword)}
            />

            <Button TextValue={'Đăng ký'} onPress={handleRegister} />

            <TouchableOpacityForm
                TextBegin={"Bạn đã có tài khoản?"}
                TextValue={'Đăng nhập'}
                onPress={() => navigation.navigate('Login')}
            />


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
        color: colors.button
    },
    buttonSignIn: {
        width: '100%',
        padding: 12,
        backgroundColor: colors.button,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    forgotPass: {
        alignSelf: 'flex-end',
        marginBottom: 16
    },
    codeFieldRoot: {
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: BUTTON_WIDTH,
    },
    cell: {
        width: CELL_WIDTH,
        height: 60,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#dfe1e5',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cellText: {
        fontSize: 24,
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#007BFF',
        shadowColor: '#007BFF',
        shadowOpacity: 0.8,
    },
    button: {
        width: BUTTON_WIDTH,
        backgroundColor: colors.button,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.button, // Match your theme
    },
    closeModalText: {
        marginTop: 15,
        color: colors.button, // Match your theme
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});