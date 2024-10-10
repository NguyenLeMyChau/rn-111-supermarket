import { getCartFailed, getCartStart, getCartSuccess } from "../store/reducers/cartSlice";


const getCartById = async (dispatch, accessToken, axiosJWT, accountId) => {
    dispatch(getCartStart());
    try {
        const response = await axiosJWT.get(`/api/customer/get-cart-by-id?accountId=${accountId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getCartSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all carts failed:', error);
        dispatch(getCartFailed());
    }
};

const addProductToCart = async (accessToken, axiosJWT, accountId, productId, quantity, price) => {
    try {
        const response = await axiosJWT.post(`/api/customer/add-product-to-cart`, {
            accountId,
            productId,
            quantity,
            price,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Add product to cart failed:', error);
    }
}

export { getCartById, addProductToCart }