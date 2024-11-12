import { useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import { getInvoicesByAccountId, updateCustomerInfo, updateStatusOrder } from "../services/userRequest";

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

    const updateStatusOrderUser = async (invoice_id, status) => {
        // Call API to update status order
        await updateStatusOrder(invoice_id, status, accessToken, axiosJWT);
    }

    return { updateUser, getInvoice, updateStatusOrderUser };
}

export default useUser;
