import { useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { addProductToCart, payCart, updateProductCart } from "../services/cartRequest";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import useCommonData from "./useCommonData";


const useCart = () => {
    const navigation = useNavigation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const { fetchDataCart } = useCommonData();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const [loadingCart, setLoadingCart] = useState(false);

    const addCart = async (productId, quantity, total) => {
        await addProductToCart(accessToken, axiosJWT, user.id, productId, quantity, total);
        await fetchDataCart(setLoadingCart);
    }

    const updateProductToCart = async (productId, quantity, total) => {
        await updateProductCart(user.id, productId, quantity,total, accessToken, axiosJWT);
        await fetchDataCart(setLoadingCart);
    }

    const payProductInCart = async (customerId, products) => {
        await payCart(navigation, accessToken, axiosJWT, customerId, products);
    }

    return { addCart, payProductInCart, updateProductToCart };
}

export default useCart;
