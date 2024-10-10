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
    }
});

export const { getCartStart, getCartSuccess, getCartFailed, resetCart } = cartSlice.actions;
export default cartSlice.reducer;