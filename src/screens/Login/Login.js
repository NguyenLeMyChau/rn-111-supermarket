import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../../constants/Color';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../services/authRequest';

import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import TouchableOpacityForm from '../../components/button/TouchableOpacityForm';
import { usePaymentModal } from '../../context/PaymentProvider';


export default function Login() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { setPaymentInfo } = usePaymentModal();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading

    // Xử lý đăng nhập với email và password
    const handleLogin = async () => {
        setIsLoading(true); // Bắt đầu quá trình đăng nhập
        const loginData = {
            phone: phone,
            password: password,
        };
        await loginUser(loginData, dispatch, navigation);
        setPaymentInfo(null);
        setIsLoading(false); // Kết thúc quá trình đăng nhập
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
                keyboardType="numeric"
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

            {isLoading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <Button TextValue={'Đăng Nhập'} onPress={handleLogin} />
            )}

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