// useFetchDataShop.js
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../services/productRequest";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { getCartById } from "../services/cartRequest";

const useCommonData = () => {
    const dispatch = useDispatch();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};

    const fetchDataShop = async (setLoading) => {
        try {
            setLoading(true); // Bắt đầu loading
            await getAllCategories(dispatch);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const fetchDataCart = async (setLoading) => {
        try {
            setLoading(true); // Bắt đầu loading
            const reponse = await getCartById(dispatch, accessToken, axiosJWT, user.id);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    }

    return { fetchDataShop, fetchDataCart };
};

export default useCommonData;