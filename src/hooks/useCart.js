import { useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { addProductToCart } from "../services/cartRequest";


const useCart = () => {
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};

    const addCart = async (productId, quantity, price) => {
        await addProductToCart(accessToken, axiosJWT, user.id, productId, quantity, price);
    }

    return { addCart };
}

export default useCart;
