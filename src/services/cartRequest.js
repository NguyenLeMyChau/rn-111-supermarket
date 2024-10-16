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
        alert('Thêm sản phẩm vào giỏ hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Add product to cart failed:', error);
        alert('Thêm sản phẩm vào giỏ hàng thất bại ', error);
    }
}

const payCart = async (navigation, accessToken, axiosJWT, customerId, products) => {
    try {
        const response = await axiosJWT.post(`/api/customer/pay-cart`, {
            customerId,
            products,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thanh toán giỏ hàng thành công');
        navigation.navigate('MainTabs');
        return response.data;
    } catch (error) {
        console.error('Pay cart failed:', error);
        alert('Thanh toán giỏ hàng thất bại ', error);
    }

}

const updateCart = async (accountId, productList, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/update-cart`, {
            accountId,
            productList,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Update cart failed:', error);
    }
}


export { getCartById, addProductToCart, payCart, updateCart }