import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    carts: null,
    isFetching: false,
    error: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        getCartStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getCartSuccess(state, action) {
            state.carts = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getCartFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetCart(state) {
            state.carts = null;
            state.isFetching = false;
            state.error = false;
        },
        updateProductQuantity(state, action) {
            const { productId, quantity, total,unit_id,quantity_donate ,promotion} = action.payload;
            console.log(state.carts)
            console.log(productId, quantity, total,unit_id)
            const product = state.carts?.find(
                (product) => product.product_id._id === productId && product.unit._id === unit_id
              );
            if (product) {
                product.quantity = quantity;
                product.total = total;
                product.quantity_donate= quantity_donate;
                product.promotions= promotion;
            }
        },
    }
});

export const { getCartStart, getCartSuccess, getCartFailed, resetCart, updateProductQuantity } = cartSlice.actions;
export default cartSlice.reducer;