import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import colors from '../../constants/Color';

import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';

import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import TouchableOpacityForm from '../../components/button/TouchableOpacityForm';


export default function Register({ navigation }) {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Xử lý đăng ký
    const handleSignUp = async () => {
        console.log('Đăng ký');
        navigation.navigate('OTP');
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>ĐĂNG KÝ</Text>

            <Input
                Icon={AntDesign}
                nameIcon={'user'}
                placeholder={'Username'}
                value={username}
                onChangeText={setUsername}
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

            <Button TextValue={'Đăng ký'} onPress={handleSignUp} />

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
    }
});