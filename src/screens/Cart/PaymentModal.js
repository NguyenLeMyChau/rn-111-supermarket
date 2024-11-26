import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../../constants/Color";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { usePaymentModal } from "../../context/PaymentProvider";
import { getPromotions, payCart } from "../../services/cartRequest";
import { useAccessToken, useAxiosJWT } from "../../util/axiosInstance";
import { useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PaymentModal({ isVisible, onClose, total, cart,openModal }) {
  const navigation = useNavigation();
  const accessToken = useAccessToken();
  const axiosJWT = useAxiosJWT();
  const user = useSelector((state) => state.auth?.login?.currentUser) || {};
  const { paymentMethod, setPaymentMethod, paymentInfo } = usePaymentModal();
  const [isPaymentPickerVisible, setPaymentPickerVisible] = useState(false); // Hiển thị modal chọn phương thức thanh toán
  const [promotion, setPromotion] = useState([]);
  const [discountedTotal, setDiscountedTotal] = useState(total);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const { emitSocketEvent, onSocketEvent } = useSocket();

  useEffect(() => {
    // Gọi API để lấy danh sách khuyến mãi
    const fetchPromotions = async () => {
      try {
        const response = await getPromotions();
        if (response) {
          // Lọc ra những khuyến mãi có type là 'percentage'
          const percentagePromotions = response.filter(
            (promo) => promo.promotionLine_id.type === "percentage"
          );
          setPromotion(percentagePromotions);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, [isVisible]);

  useEffect(() => {
    // Tính toán tổng tiền đã giảm mỗi khi promotion thay đổi
    if (promotion?.length > 0) {
      let currentTotal = total; // Bắt đầu từ tổng ban đầu
      const finalTotals = promotion.map((applicablePromotion) => {
        // Kiểm tra điều kiện để áp dụng khuyến mãi
        if (currentTotal > applicablePromotion.amount_sales) {
          const discountAmount =
            (currentTotal * applicablePromotion.percent) / 100;
          const amountLimit = applicablePromotion.amount_limit;

          // Giảm giá không vượt quá amount_limit
          if (discountAmount > amountLimit) {
            currentTotal -= amountLimit;
          } else {
            currentTotal -= discountAmount;
          }
        } else {
          // Nếu không đủ điều kiện, giữ nguyên currentTotal
          currentTotal = total;
        }

        console.log(currentTotal);
        return currentTotal;
      });
      const minTotal = Math.min(...finalTotals);
      console.log(minTotal);
      console.log(total);
      if (minTotal === total) {
        setDiscountedTotal(total);
        setAppliedPromotion(null);
      }else{  
        
        setDiscountedTotal(minTotal);
        const bestPromotion = promotion[finalTotals.indexOf(minTotal)];
        setAppliedPromotion(bestPromotion);}
    }
  }, [promotion, total]);

  const paymentMethods = [
    { id: "1", name: "ZaloPay", icon: require("../../../assets/icon-zalopay.jpg") },
    
    // { id: '4', name: 'Tiền mặt', icon: require('../../../assets/icon-tien-mat.png') },
  ];

  const renderPaymentMethod = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentMethod}
      onPress={() => handleSelectPaymentMethod(item)}
    >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.paymentMethodText}>{item.name}</Text>
      {paymentMethod?.id === item.id && (
        <Text style={styles.selectedText}>✓</Text>
      )}
    </TouchableOpacity>
  );

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    setPaymentPickerVisible(false);
  };

  const handleOrder = async () => {
    if (!paymentInfo) {
      alert("Vui lòng nhập thông tin nhận hàng");
      return;
    }
  
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }
  
    if (paymentMethod.name === "ZaloPay") {
      try {
        // Gửi yêu cầu thanh toán đến backend để tạo đơn thanh toán ZaloPay
        const response = await axiosJWT.post("/api/payment/paymentapp", {
          amount:discountedTotal
        });
        console.log(response)
        if (response.data.paymentUrl.return_message === "Giao dịch thành công") {
          // Lấy URL thanh toán ZaloPay từ backend
          const zaloPayUrl = response.data.paymentUrl.order_url;
          await AsyncStorage.setItem('app_trans_id', response.data.app_trans_id);
          onClose();
          // Chuyển hướng người dùng đến WebView để thanh toán ZaloPay
          navigation.navigate("ViewPayZalo", { 
            url: zaloPayUrl,
            paymentInfo: paymentInfo, 
            cart: cart,
            discountedTotal: discountedTotal,
            appliedPromotion: appliedPromotion,
            paymentMethod: paymentMethod,
            total: total,
            user: user,
            accessToken: accessToken,
            axiosJWT,
            app_trans_id:response.data.app_trans_id,
            emitSocketEvent
          });
        } else {
          alert("Có lỗi xảy ra khi tạo yêu cầu thanh toán ZaloPay");
        }
      } catch (error) {
        console.error("Error calling backend for ZaloPay payment:", error);
        alert("Có lỗi xảy ra trong quá trình thanh toán.");
      }
    }
    // if (paymentMethod.name === "ZaloPay") {
    //   const address = {
    //     street: paymentInfo.street,
    //     city: paymentInfo.city,
    //     district: paymentInfo.district,
    //     ward: paymentInfo.ward,
    //   };
  
    //   paymentInfo.address = address;
    //   payCart(
    //     navigation,
    //     accessToken,
    //     axiosJWT,
    //     user.id,
    //     cart,
    //     paymentMethod.name,
    //     paymentInfo,
    //     discountedTotal,
    //     appliedPromotion,
    //     total-discountedTotal,
    //     total,
    //     emitSocketEvent
    //   );
    //   onClose();
    // }
  };
  

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Thanh toán</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="cancel" size={28} color={colors.button} />
                </TouchableOpacity>
              </View>

              <View style={styles.sectionRow}>
                <Text style={styles.label}>Thông tin nhận hàng</Text>
                <TouchableOpacity
                  style={styles.selectMethod}
                  onPress={() => {
                    onClose();
                    navigation.navigate("PaymentInfo");
                  }}
                >
                  <Text style={styles.selectMethodText}>
                    {paymentInfo ? paymentInfo.phone : "Nhập thông tin"}
                  </Text>
                  <Icon name="keyboard-arrow-right" size={20} />
                </TouchableOpacity>
              </View>

              <View style={{ ...styles.sectionRow, paddingVertical: 10 }}>
                <Text style={styles.label}>Phương thức thanh toán</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => setPaymentPickerVisible(true)}
                >
                  {/* Hiển thị icon của phương thức thanh toán đã chọn */}
                  {paymentMethod ? (
                    <Image source={paymentMethod.icon} style={styles.icon} />
                  ) : (
                    <Text style={styles.pickerText}>Chọn</Text>
                  )}
                  <Icon name="arrow-drop-down" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Display Total, Discount, and Final Total */}
              <View style={styles.sectionRow}>
                <Text style={styles.label}>Tổng tiền sản phẩm</Text>
                <Text style={styles.total}>
                  {total.toLocaleString("vi-VN")} đ
                </Text>
              </View>

              {appliedPromotion ? (
                <>
                  <View style={styles.sectionRow}>
                    <Text style={[styles.label,{fontWeight:'bold'}]}>{appliedPromotion.description}</Text>
                    <Text style={styles.discountText}>
                      - {(total - discountedTotal).toLocaleString("vi-VN")} đ
                    </Text>
                  </View>
                  <View style={styles.sectionRow}>
                    <Text style={styles.label}>Tổng thanh toán</Text>
                    <Text style={styles.total}>
                      {discountedTotal.toLocaleString("vi-VN")} đ
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.sectionRow}>
                  <Text style={styles.label}>Tổng thanh toán</Text>
                  <Text style={styles.total}>
                    {total.toLocaleString("vi-VN")} đ
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.button} onPress={handleOrder}>
                <Text style={styles.textButton}>Đặt hàng</Text>
              </TouchableOpacity>

              {/* Modal Picker for Payment Methods */}
              <Modal
                visible={isPaymentPickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPaymentPickerVisible(false)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setPaymentPickerVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                      <View style={styles.pickerModalContent}>
                        <FlatList
                          data={paymentMethods}
                          renderItem={renderPaymentMethod}
                          keyExtractor={(item) => item.id}
                          style={styles.paymentList}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  discountText: {
    fontSize: 18,
    color: "red",
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "medium",
    color: "#7C7C7C",
  },
  promotionText: {
    fontSize: 16,
    fontWeight: "medium",
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  paymentMethodText: {
    fontSize: 16,
    flex: 1,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    color: "red",
    textDecorationLine: "line-through",
  },
  button: {
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "30%",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
  },
  promoInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    width: "100%",
  },
  selectMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectMethodText: {
    fontSize: 16,
  },
});
