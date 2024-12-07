import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { logoutSuccess, resetLogoutState } from "../store/reducers/authSlice";
import { resetCart } from "../store/reducers/cartSlice";
import { BASE_URL } from "./url";

const refreshToken = async () => {
    try {
        const refreshToken = AsyncStorage.getItem('refreshToken');

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, { refreshToken },
            {
                withCredentials: true, // Gửi cookie kèm theo request để server có thể đọc cookie
            });

        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

        return response.data;
    } catch (error) {
        console.log('Refresh token failed:', error);
    }
};

export const createAxiosInstance = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        // baseURL: 'http://localhost:5000',
        baseURL: `${BASE_URL}`,
    });

    newInstance.interceptors.request.use(
        async (config) => {
            const decodedToken = jwtDecode(user.accessToken);

            if (decodedToken.exp * 1000 < Date.now()) { // Token hết hạn
                try {
                    const newToken = await refreshToken();
                    const refreshUser = {
                        ...user,
                        accessToken: newToken.accessToken
                    };
                    dispatch(stateSuccess(refreshUser));
                    config.headers.Authorization = `Bearer ${newToken.accessToken}`; // Gán token mới cho header Authorization 
                } catch (error) {
                    dispatch(logoutSuccess());
                    dispatch(resetCart());

                    // Xóa refresh token khỏi AsyncStorage
                    await AsyncStorage.removeItem('refreshToken');

                    setTimeout(() => {
                        dispatch(resetLogoutState());
                    }, 1000);
                   
                }
            } else {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return newInstance;
};
