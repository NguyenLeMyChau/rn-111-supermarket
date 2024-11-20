import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import colors from "../../constants/Color";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Icon
import { useDispatch, useSelector } from "react-redux"; // Import dispatch from Redux
import { updateProductQuantity } from "../../store/reducers/cartSlice";
import {
  checkStockQuantityInCart,
  getPromotionByProductId,
  removeProductCart,
} from "../../services/cartRequest";
import { useAccessToken, useAxiosJWT } from "../../util/axiosInstance";
import useCommonData from "../../hooks/useCommonData";
import { loadingContainer } from "../../constants/Loading";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { fetchDataCart } = useCommonData();
  const accessToken = useAccessToken();
  const axiosJWT = useAxiosJWT();
  const user = useSelector((state) => state.auth?.login?.currentUser) || {};
  const cart = useSelector((state) => state.cart?.carts) || [];
  const [quantity, setQuantity] = useState(item.quantity);
  const [loadingCart, setLoadingCart] = useState(false);
  const [giakhuyenmai, setGiaKhuyeMai] = useState(-1);
  const [khuyenMai, setKhuyenMai] = useState("");
  const [type, setType] = useState("");
  const [giaBan, setGiaBan] = useState(item.quantity * item.price.price);
  const [quantity_donate,setQuantity_donate] = useState(0);
  const [promotionApply,setPromotionApply] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const promotions = await getPromotionByProductId(item.product_id._id, item.unit._id);
        if (promotions?.length > 0) {
          const promotion = promotions[0];
          setKhuyenMai(promotion); // Assuming only the first promotion found is used
          if (promotion.promotionLine_id.type === "amount") {
            setQuantity_donate(quantity)
            setGiaKhuyeMai((item.price.price - promotion.amount_donate) * quantity);
            setType(promotion.promotionLine_id.type);
          } else if (promotion.promotionLine_id.type === "quantity") {
            setType(promotion.promotionLine_id.type);
             // Trường hợp 1: product_id === promotion.product_id === promotion.product_donate
             if (
              item.product_id._id === promotion.product_id &&
              item.product_id._id === promotion.product_donate &&
              item.unit._id === promotion.unit_id?._id &&    
              item.unit._id=== promotion.unit_id_donate?._id
            )
            {
              const totalQuantity =
              promotion.quantity + promotion.quantity_donate;
            const eligibleQuantity = Math.floor(
              item.quantity / totalQuantity
            );
           
              if (eligibleQuantity > 0) {
                setQuantity_donate(eligibleQuantity)
                setPromotionApply(promotion._id)
                setGiaKhuyeMai((quantity - eligibleQuantity) * item.price.price)
              }
               // Trường hợp 2: product_id === promotion.product_id và product_id !== promotion.product_donate
            } else if (
              item.product_id._id === promotion.product_id &&
              ( item.product_id._id !== promotion.product_donate ||
                item.unit._id !== promotion.unit_id_donate?._id)
            ) { const eligibleQuantity = Math.floor(
              quantity / promotion.quantity
            );
          
              const donateProductExists = cart.find(cartItem => cartItem.product_id._id === promotion.product_id && cartItem.unit._id === promotion.unit_id_donate._id);
            
              if(!donateProductExists){
                setPromotionApply(null);
                setQuantity_donate(0);
                setGiaKhuyeMai(-1)
              }
              if(eligibleQuantity<1){
                setPromotionApply(null);
                setQuantity_donate(0);
                setGiaKhuyeMai(-1)
              }
              setQuantity_donate(0);
              setGiaKhuyeMai(-1)
            }else if (
              (item.product_id._id !== promotion.product_id &&
                item.product_id._id === promotion.product_donate) ||
              (item.product_id._id === promotion.product_donate &&
                item.unit._id === promotion.unit_id_donate?._id)
            ) {
              const promotionProductExists = cart.find(cartItem => cartItem.product_id._id === promotion.product_id && cartItem.unit._id === promotion.unit_id._id);

              const eligibleQuantity = Math.floor(
                promotionProductExists?.quantity / promotion.quantity
              );
            
              if (!promotionProductExists || eligibleQuantity < 1) {
                setPromotionApply(null);
                setQuantity_donate(0);
                setGiaKhuyeMai(-1)
              }
              setQuantity_donate(eligibleQuantity)
              setPromotionApply(promotion._id)
              const gia = (quantity - eligibleQuantity) * item.price.price;
              setGiaKhuyeMai(gia>=0?gia:0);
            }
          } 
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khuyến mãi:", error);
      }
    };

    fetchPromotion();
  }, [item.product_id, quantity, cart]);

  useEffect(() => {
  
    dispatch(
      updateProductQuantity({
        productId: item.product_id._id,
        quantity: quantity,
        total: giakhuyenmai>=0?giakhuyenmai:giaBan,
        unit_id: item.unit._id,
        quantity_donate: quantity_donate,
        promotion:promotionApply,
      })
    );
  }, [giakhuyenmai])

  // Cập nhật số lượng sản phẩm
  const handleUpdateQuantity = async (newQuantity) => {
    setQuantity(newQuantity);
    setGiaBan(newQuantity * item.price.price);

    // // Tính lại giá khuyến mãi
    // let updatedGiaKhuyenMai = -1;
    // if (khuyenMai) {
    //     console.log(khuyenMai)
    //   // Giả sử bạn đã có thông tin khuyến mãi, tính toán lại giá khuyến mãi
    //   if (type === "amount") {
    //     updatedGiaKhuyenMai =
    //       (item.price.price - khuyenMai.amount_donate) * newQuantity;

    //   } else if (type === "quantity") {
    //     if (khuyenMai.product_donate === item.product_id && khuyenMai.product_id === item.product_id) {
    //         console.log(khuyenMai.product_donate,item.product_id)

    //         const eligibleQuantity =Math.floor(newQuantity / (khuyenMai.quantity + khuyenMai.quantity_donate))
    //         console.log(eligibleQuantity)
    //       if (eligibleQuantity>0) {
    //         updatedGiaKhuyenMai =  (newQuantity - eligibleQuantity) *  item.price.price
    //         console.log( newQuantity)
    //         console.log(updatedGiaKhuyenMai)

    //       }
    //     } else if(khuyenMai.product_donate === item.product_id && khuyenMai.product_id!==item.product_id){
    //         // If product_donate !== item.product_id, check the cart for product_id === item.product_id
    //         const cartItem = cart.find(cartItem => cartItem.product_id === khuyenMai.product_id);
    //         console.log(cartItem)
    //       if (cartItem) {
    //         // Compare cartItem.quantity / promotion.quantity
    //         const num = (cartItem.quantity / khuyenMai.quantity) | 0;
    //         console.log(num)
    //         if (num > 0) {
    //             if(num > quantity){
    //                 updatedGiaKhuyenMai = 0
    //             console.log((quantity - num * khuyenMai.quantity_donate) * item.price.price)

    //                 }
    //           else updatedGiaKhuyenMai=
    //             (quantity - num * khuyenMai.quantity_donate) * item.price.price

    //         } 
    //         }
    //       }
    //   }

    // }

    // Dispatch cập nhật giỏ hàng với giá trị mới

  };

  // Giảm số lượng
  const handleDecreaseQuantity = async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      // Gọi checkStockQuantity trước khi cập nhật
      const isStockAvailable = await checkStockQuantityInCart(
        item.item_code,
        item.unit._id,
        newQuantity,
        accessToken,
        axiosJWT
      );
      if (isStockAvailable.inStock) {
        handleUpdateQuantity(newQuantity);
      } else {
        alert(isStockAvailable.message);
      }
    }
  };

  // Tăng số lượng
  const handleIncreaseQuantity = async () => {
    const newQuantity = quantity + 1;
    // Gọi checkStockQuantity trước khi cập nhật
    const isStockAvailable = await checkStockQuantityInCart(
      item.item_code,
      item.unit._id,
      newQuantity,
      accessToken,
      axiosJWT
    );
    if (isStockAvailable.inStock) {
      handleUpdateQuantity(newQuantity);
    } else {
      alert(isStockAvailable.message);
    }
  };

  // Xử lý thay đổi số lượng qua TextInput
  const handleInputChange = async (text) => {
    const newQuantity = Number(text);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      // Gọi checkStockQuantity trước khi cập nhật
      const isStockAvailable = await checkStockQuantityInCart(
        item.item_code,
        item.unit._id,
        newQuantity,
        accessToken,
        axiosJWT
      );
      if (isStockAvailable.inStock) {
        handleUpdateQuantity(newQuantity);
      } else {
        alert(isStockAvailable.message);
      }
    }
  };

  const handleRemoveItem = async () => {
    // Logic để xóa mục khỏi giỏ hàng
    await removeProductCart(user.id, item.product_id._id, item.unit._id, accessToken, axiosJWT);
    await fetchDataCart(setLoadingCart);
  };

  return (
    <View style={styles.itemContainer}>
      <View style={{ width: "28%", height: 100, paddingRight: 10 }}>
        <Image style={styles.itemImage} source={{ uri: item.img }} />
      </View>
      <View style={{ width: "45%" }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemUnit}>{item.unit.description}</Text>
        {khuyenMai && (
          <Text style={styles.itemPromotion}>
            {khuyenMai.description}
          </Text>
        )}

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleDecreaseQuantity}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.itemQuantity}
            value={String(quantity)}
            onChangeText={handleInputChange}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleIncreaseQuantity}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.priceContainer}>
        {loadingCart ? (
          <View style={loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => handleRemoveItem()}
            style={styles.buttonRemove}
          >
            <Icon name="cancel" size={28} color={colors.button} />
          </TouchableOpacity>
        )}
        <View style={styles.priceTextContainer}>
          {giakhuyenmai >= 0 && khuyenMai ? (

            <View>
              <Text style={styles.itemDiscountPrice}>
                {giakhuyenmai.toLocaleString("vi-VN")} đ
              </Text>
              <Text style={styles.itemOriginalPrice}>
                {giaBan.toLocaleString("vi-VN")} đ
              </Text>
            </View>
          ) : (
            <Text style={styles.itemPrice}>
              {giaBan.toLocaleString("vi-VN")} đ
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    alignSelf: "stretch",
    height: "auto",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E2E2",
    flexDirection: "row",
    paddingVertical: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "medium",
    width: "100%",
  },
  itemUnit: {
    fontSize: 13,
    color: "#888",
  },
  itemPromotion: {
    color: "red",
    fontSize: 14,
  },
  itemOriginalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#888",
    textAlign: "right",
  },
  itemDiscountPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "red",
    textAlign: "right",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E2E2",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.button,
  },
  itemQuantity: {
    width: 50,
    height: 40,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E2E2",
    marginHorizontal: 8,
    color: colors.button,
  },
  priceContainer: {
    width: "23%",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceTextContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: -20,
  },
  buttonRemove: {
    width: 40,
    height: 40,
    alignItems: "flex-end",
  },
});

export default CartItem;
