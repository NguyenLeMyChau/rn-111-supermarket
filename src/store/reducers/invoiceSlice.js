import { createSlice } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

const initialState = {
    invoices: null,
    isFetching: false,
    error: false,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        getInvoiceStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getInvoiceSuccess(state, action) {
            state.invoices = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getInvoiceFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetInvoice(state) {
            state.invoices = null;
            state.isFetching = false;
            state.error = false;
        },
        addInvoice(state, action) {
            console.log(action.payload)
            const existingInvoice = state.invoices?.find(
                (invoice) => invoice.invoiceCode === action.payload.invoiceCode
            );
        console.log(`Invoice ${existingInvoice}`)
            if (!existingInvoice) {
                alert(`Hóa đơn mới: ${action.payload.invoiceCode}`);
                state.invoices = [...state.invoices, action.payload.invoice];
            }
            state.isFetching = false;
            state.error = false;
        },
        updateInvoiceStatus(state, action) {
            const { invoiceCode, status } = action.payload;
            const invoiceIndex = state.invoices?.findIndex(
                (invoice) => invoice.invoiceCode === invoiceCode && invoice.status !== status
            );
            if (invoiceIndex !== -1) {
                Alert.alert("Thông báo",`Cập nhật trạng thái hóa đơn: ${invoiceCode} - ${status}`);
                state.invoices[invoiceIndex] = {
                    ...state.invoices[invoiceIndex],
                    status,
                };
            }
        },
    }
});

export const { getInvoiceStart, getInvoiceSuccess, getInvoiceFailed, resetInvoice, addInvoice,
    updateInvoiceStatus } = invoiceSlice.actions;
export default invoiceSlice.reducer;