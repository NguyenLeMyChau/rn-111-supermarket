import { useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import { getInvoicesByAccountId, getInvoicesByInvoiceCode, updateCustomerInfo, updateStatusOrder } from "../services/userRequest";
import { registerCustomer } from "../services/authRequest";

const useUser = () => {
    const navigation = useNavigation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser);

    const updateUser = async (accountId, customerInfo) => {
        await updateCustomerInfo(accountId, customerInfo, navigation, accessToken, axiosJWT);
    }

    const getInvoice = async () => {
        await getInvoicesByAccountId(user.id, accessToken, axiosJWT);
    }

    const updateStatusOrderUser = async (invoice, status, reason, emitSocketEvent) => {
        // Call API to update status order
        await updateStatusOrder(invoice, status, reason, accessToken, axiosJWT, emitSocketEvent);
    }

    const getInvoicesByInvoiceCodeUser = async (dispatch, invoiceCode) => {
        // Call API to update status order
        await getInvoicesByInvoiceCode(accessToken, axiosJWT, dispatch, invoiceCode);
    }

    return { updateUser, getInvoice, updateStatusOrderUser, getInvoicesByInvoiceCodeUser };
}

export default useUser;
