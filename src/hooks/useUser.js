import { useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import { updateCustomerInfo } from "../services/userRequest";

const useUser = () => {
    const navigation = useNavigation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const updateUser = async (accountId, customerInfo) => {
        await updateCustomerInfo(accountId, customerInfo, navigation, accessToken, axiosJWT);
    }

    return { updateUser };
}

export default useUser;
