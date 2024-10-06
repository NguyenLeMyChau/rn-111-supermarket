import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import colors from '../../constants/Color';

import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import TouchableOpacityForm from '../../components/button/TouchableOpacityForm';

export default function Login({ navigation }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Xử lý đăng nhập với email và password
    const handleLogin = async () => {
        console.log('Đăng nhập với email và password');
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>ĐĂNG NHẬP</Text>

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

            <TouchableOpacity style={styles.forgotPass}>
                <Text style={{ color: colors.title }}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <Button TextValue={'Đăng Nhập'} onPress={handleLogin} />

            <TouchableOpacityForm
                TextBegin={"Bạn chưa có tài khoản?"}
                TextValue={'Đăng ký'}
                onPress={() => navigation.navigate('Register')}
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
        color: colors.title
    },
    forgotPass: {
        alignSelf: 'flex-end',
        marginBottom: 16
    }

});