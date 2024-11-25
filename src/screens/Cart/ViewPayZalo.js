import React from "react";
import { ActivityIndicator, NativeModules, View } from "react-native";
import WebView from "react-native-webview";
import { payCart } from "../../services/cartRequest";

const ViewPayZalo = ({ route, navigation }) => {
  const {
    url,
    paymentInfo,
    cart,
    discountedTotal,
    appliedPromotion,
    paymentMethod,
    total,
    user,
    accessToken,
    emitSocketEvent
  } = route.params; // Lấy thông tin đã truyền qua params
console.log(url)
  const handleNavigationStateChange = (state) => {
    console.log(state)
    // Kiểm tra URL quay lại từ ZaloPay
    if (state.url.includes("your_redirect_uri")) {
      const result = getUrlParams(state.url); // Lấy thông tin từ URL trả về

      if (result.paymentStatus === "success") {
        // Thanh toán thành công, thực hiện payCart
        handlePayCart(result.transactionId);
      } else {
        alert("Thanh toán thất bại.");
      }
    }
  };

  const getUrlParams = (url) => {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return {
      paymentStatus: urlParams.get('status'),
      transactionId: urlParams.get('transactionId'),
    };
  };

  const handlePayCart = async (transactionId) => {
    // Gọi API hoặc xử lý logic thanh toán giỏ hàng
    console.log(transactionId)
    const address = {
      street: paymentInfo.street,
      city: paymentInfo.city,
      district: paymentInfo.district,
      ward: paymentInfo.ward,
    };

    paymentInfo.address = address;

    try {
      // Thực hiện thanh toán giỏ hàng
      await payCart(
        navigation,
        accessToken,
        axiosJWT,
        user.id,
        cart,
        paymentMethod.name,
        paymentInfo,
        discountedTotal,
        appliedPromotion,
        total - discountedTotal,
        total,
        emitSocketEvent,
        transactionId
      );
      navigation.navigate("OrderSuccess"); // Chuyển hướng đến trang thành công
    } catch (error) {
      console.error("Error processing cart payment:", error);
      alert("Có lỗi xảy ra khi thanh toán giỏ hàng.");
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        style={{ flex: 1 }}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        onNavigationStateChange={handleNavigationStateChange}
        renderLoading={() => (
          <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
        )}
      />
    </View>
  );
};

export default ViewPayZalo;
