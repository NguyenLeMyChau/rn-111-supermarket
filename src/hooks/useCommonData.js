// useFetchDataShop.js
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, getAllProducts } from "../services/productRequest";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { getCartById } from "../services/cartRequest";
import { usePaymentModal } from "../context/PaymentProvider";

const useCommonData = () => {
    const dispatch = useDispatch();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const { setPreviousCart } = usePaymentModal();

    const fetchDataShop = async (setLoading) => {
        try {
            setLoading(true); // Bắt đầu loading
            await getAllCategories(dispatch);
            await getAllProducts(dispatch);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const fetchDataCart = async (setLoading) => {
        try {
            setLoading(true); // Bắt đầu loading
            const cart = await getCartById(dispatch, accessToken, axiosJWT, user.id);
            setPreviousCart(cart);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    }

    return { fetchDataShop, fetchDataCart };
};

export default useCommonData;
