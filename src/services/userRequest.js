import { getInvoiceFailed, getInvoiceStart, getInvoiceSuccess } from "../store/reducers/invoiceSlice";

const updateCustomerInfo = async (accountId, customerInfo, navigation, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/customer/update-customer/${accountId}`, {
            accountId,
            customerInfo,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Vui lòng đăng nhập lại để cập nhật thông tin mới, chúng tôi xin lỗi vì sự bất tiện này');
        navigation.navigate('Login');
        return response.data;
    } catch (error) {
        console.error('Update product cart failed:', error);
    }
}

const getInvoicesByAccountId = async (accountId, accessToken, axiosJWT, dispatch) => {
    dispatch(getInvoiceStart());
    try {
        const response = await axiosJWT.get(`/api/customer/get-invoice/${accountId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getInvoiceSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get invoices failed:', error);
        dispatch(getInvoiceFailed());
    }
}
const getInvoicesByInvoiceCode = async (accessToken, axiosJWT,dispatch,invoiceCode,accountId) => {
    console.log(invoiceCode);
    try {
        const response = await axiosJWT.post(`/api/invoice/get-invoice-by-invoiceCode`,{invoiceCode}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if(response.data && response.data.customer_id===accountId)
        { 
            console.log(response.data);
            return response.data;
        }
    } catch (error) {
      console.log(error);
    }
};

const updateStatusOrder = async (invoice, status, accessToken, axiosJWT,emitSocketEvent) => {
    try {
        const response = await axiosJWT.put(`/api/invoice/update-status-order`, {
            invoice_id:invoice._id,
            status,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        emitSocketEvent("updateStatusSuccess",{invoiceCode:invoice.invoiceCode, status});

        return response.data;
    } catch (error) {
        console.error('Update status order failed:', error);
    }
}

export { updateCustomerInfo, getInvoicesByAccountId, updateStatusOrder,getInvoicesByInvoiceCode };