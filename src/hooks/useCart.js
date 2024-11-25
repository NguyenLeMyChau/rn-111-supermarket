import { useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { addProductToCart, checkStockQuantityInCart, payCart, removeProductCart, updateProductCart } from "../services/cartRequest";
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

    const addCart = async (productId, unitId, quantity, total,promotion) => {
        console.log(promotion)
        await addProductToCart(accessToken, axiosJWT, user.id, productId, unitId, quantity, total,promotion);
        
        await fetchDataCart(setLoadingCart);
    }

    const updateProductToCart = async (productId, unitId, quantity, total) => {
        console.log(productId, unitId, quantity, total);
        await updateProductCart(user.id, productId, unitId, quantity, total, accessToken, axiosJWT);
        await fetchDataCart(setLoadingCart);
    }
    const removeProductFromCart = async (accountId, productId, unit_id) => {
        await removeProductCart(accountId, productId, unit_id, accessToken, axiosJWT);
        await fetchDataCart(setLoadingCart);
    }
    const payProductInCart = async (customerId, products) => {
        await payCart(navigation, accessToken, axiosJWT, customerId, products);
    }

    const checkStockQuantity = async (item_code, unit_id, quantity) => {
        await checkStockQuantityInCart(item_code, unit_id, quantity, accessToken, axiosJWT);
    }

    return { addCart, payProductInCart, updateProductToCart, checkStockQuantity,removeProductFromCart };
}

export default useCart;
