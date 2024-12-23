import axios from "axios";
import { getCartFailed, getCartStart, getCartSuccess } from "../store/reducers/cartSlice";
import { BASE_URL } from "../util/url";
import { Alert } from "react-native";


const getCartById = async (dispatch, accessToken, axiosJWT, accountId) => {
    dispatch(getCartStart());
    try {
        const response = await axiosJWT.get(`/api/customer/get-cart-by-id?accountId=${accountId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        dispatch(getCartSuccess(response.data));
        return response.data;
    } catch (error) {
        // console.error('Get all carts failed:', error);
        dispatch(getCartFailed());
    }
};
const getPromotionByProductId = async (product_id, unit_id) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/get-promotion-by-product`, { product_id, unit_id });
        if (!response.data) {
            return null; // hoặc return {} hoặc [] tùy thuộc vào nhu cầu của bạn
        }
        console.log(response.data)
        return response.data;
    } catch (error) {
    }
}
const getPromotions = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/auth/get-promotions`);
        console.log(response.data)
        return response.data;
    } catch (error) {
    }
}


const addProductToCart = async (accessToken, axiosJWT, accountId, productId, unitId, quantity, total,promotions) => {
    try {
        const response = await axiosJWT.post(`/api/customer/add-product-to-cart`, {
            accountId,
            productId,
            unitId,
            quantity,
            total,
            promotions,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        Alert.alert("Thành công",'Thêm sản phẩm vào giỏ hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Add product to cart failed:', error);
        Alert.alert("Thông báo",'Thêm sản phẩm vào giỏ hàng thất bại ');
    }
}

const payCart = async (navigation, accessToken, axiosJWT, customerId, products, paymentMethod, paymentInfo, paymentAmount,promotionOnInvoice,discountPayment,
    totalPayment,emitSocketEvent) => {
    try {
        const response = await axiosJWT.post(`/api/customer/pay-cart`, {
            customerId,
            products,
            paymentMethod,
            paymentInfo,
            paymentAmount,
            promotionOnInvoice,
            discountPayment,
            totalPayment
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (response.data.success) {
            emitSocketEvent("paymentSuccess", response.data);
            navigation.navigate('OrderSuccess');
        } else Alert.alert("Thông báo",'Thanh toán giỏ hàng thất bại ');

        return response.data;
    } catch (error) {
        console.error('Pay cart failed:', error);
        Alert.alert("Lỗi",'Thanh toán giỏ hàng thất bại ');
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
        // console.error('Update cart failed:', error);
    }
}

const removeProductCart = async (accountId, productId, unit_id, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/remove-product-cart`, {
            accountId,
            productId,
            unit_id,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Remove product cart failed:', error);
    }
}

const updateProductCart = async (accountId, productId, unitId, quantity, total, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/update-product-cart`, {
            accountId,
            productId,
            unitId,
            quantity,
            total
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        Alert.alert("Thành công",'Cập nhật giỏ hàng thành công');
        return response.data;
    } catch (error) {
    }
}

const checkStockQuantityInCart = async (item_code, unit_id, quantity, accessToken, axiosJWT) => {
    try {
        // Gửi yêu cầu GET với item_code và quantity qua query params
        const response = await axiosJWT.get(`/api/customer/check-stock-quantity-in-cart`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: { // Thêm params ở đây
                item_code: item_code,
                unit_id: unit_id,
                quantity: quantity
            }
        });
        console.log('response.data', response.data)
        return response.data;
    } catch (error) {
        console.error('Check stock quantity failed:', error);
        Alert.alert("Thông báo",error.response ? error.response.data.message : error.message);
    }
}
const checkPaymentStatus = async (axiosJWT,appTransId) => {
    try {
      const response = await axiosJWT.post(`/api/zalo-pay/order-status/${appTransId}`);
      console.log(response);
      return response.data;

    //   if (response.data.return_code === 1) {
    //     setPaymentStatus("Thanh toán thành công!");
    //   } else {
    //     setPaymentStatus("Thanh toán thất bại.");
    //   }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };



export {
    getCartById,
    addProductToCart,
    payCart,
    updateCart,
    removeProductCart,
    updateProductCart,
    getPromotionByProductId,
    checkStockQuantityInCart,
    getPromotions,
    checkPaymentStatus
}