import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, resetLogoutState } from '../store/reducers/authSlice';
import { jwtDecode } from "jwt-decode";
import { resetCart } from '../store/reducers/cartSlice';
import { Alert } from 'react-native';
import { BASE_URL } from '../util/url';


const loginUser = async (loginData, dispatch, navigation) => {
    dispatch(loginStart());
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);

        const { accessToken, refreshToken } = response.data;

        // Lưu trữ refresh token trong AsyncStorage
        await AsyncStorage.setItem('refreshToken', refreshToken);

        // Giải mã accessToken để lấy thông tin người dùng
        const decodedToken = jwtDecode(accessToken);

        const { exp, iat, ...userWithoutExpIat } = decodedToken;

        const userWithToken = {
            ...userWithoutExpIat,
            accessToken: response.data.accessToken
        };

        console.log('User with token:', userWithToken);

        // Lưu thông tin người dùng vào redux store 
        dispatch(loginSuccess(userWithToken));

        if (userWithToken.role === 'customer') {
            navigation.navigate('MainTabs');
        } else {
            alert('Bạn không thể truy cập vào trang này');
        }

    } catch (error) {
        dispatch(loginFailed());
        console.error('Login failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const logoutUser = async (dispatch, navigation, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post(`/api/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        await dispatch(logoutSuccess());
        await dispatch(resetCart());

        // Xóa refresh token khỏi AsyncStorage
        await AsyncStorage.removeItem('refreshToken');

        navigation.navigate('MainTabs');

        setTimeout(() => {
            dispatch(resetLogoutState());
        }, 1000);
        // await dispatch(resetDataManager());
    } catch (error) {
        dispatch(logoutFailed());
        console.error('Logout failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}


const registerCustomer = async (registerData) => {
    try {
        const response = await axios.post(`/api/auth/register-customer`, registerData);
       alert('Đăng ký khách hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Resign customer failed:', error);
       alert(error.response ? error.response.data.message : error.message);
    }
}

export { loginUser, logoutUser, registerCustomer };