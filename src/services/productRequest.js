import axios from "axios";
import { getCategoryFailed, getCategoryStart, getCategorySuccess } from "../store/reducers/categorySlice";

// const getAllCategories = async (dispatch) => {
//     dispatch(getCategoryStart());
//     try {
//         const response = await axios.get(`https://be-111-supermarket.vercel.app/api/auth/get-categories`);
//         console.log(response.data)
//         dispatch(getCategorySuccess(response.data));
//         return response.data;
//     } catch (error) {
//         console.error('Get all categories failed:', error);
//         dispatch(getCategoryFailed());
//     }
// };

// export { getAllCategories };


const getAllCategories = async (dispatch) => {
    dispatch(getCategoryStart());
    try {
        const response = await axios.get(`http://localhost:5000/api/auth/get-products-with-price-and-promotion`);
        console.log(response.data)
        dispatch(getCategorySuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all categories failed:', error);
        dispatch(getCategoryFailed());
    }
};

export { getAllCategories };