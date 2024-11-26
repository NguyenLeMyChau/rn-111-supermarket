import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, View, Alert, Text } from "react-native";
import WebView from "react-native-webview";
import { checkPaymentStatus, payCart } from "../../services/cartRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    axiosJWT,
    app_trans_id,
    emitSocketEvent,
  } = route.params; // Lấy thông tin đã truyền qua params

 
  const [currentUrl, setCurrentUrl] = useState(url); // Lưu URL hiện tại
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef(null); // Lưu tham chiếu đến timeout
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút (900 giây)

  useEffect(() => {
    startTimeout();
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      clearTimeout(timeoutRef.current);
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft]);
  const startTimeout = () => {
    timeoutRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000); // Giảm thời gian còn lại mỗi giây
  };

  const handleTimeout = () => {
    clearInterval(timeoutRef.current); // Dừng hẹn giờ
    Alert.alert(
      "Thông báo",
      "Phiên thanh toán đã hết hạn. Vui lòng thử lại.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };
  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      console.log("App returned to foreground");
      setCurrentUrl(url); // Đặt lại URL cho WebView khi quay lại
      checkPaymentStatusPay(); // Kiểm tra trạng thái thanh toán
    }
    appState.current = nextAppState;
  };
  

  const handleNavigationStateChange = (navState) => {
    console.log(navState);
    setCurrentUrl(navState.url); // Đảm bảo sử dụng navState.url
  };
  

  const checkPaymentStatusPay = async () => {
    const responseCheck = await checkPaymentStatus(axiosJWT, app_trans_id);
    console.log(responseCheck);
    if (responseCheck.return_message === "Giao dịch thành công") {
      handlePayCart(app_trans_id);
    } else {
      Alert.alert("Thanh toán thất bại", "Giao dịch chưa được thực hiện");
      setCurrentUrl(url); // Đảm bảo cập nhật lại WebView với URL ban đầu
    }
  };
  


  const handlePayCart = async (transactionId) => {
    const address = {
      street: paymentInfo.street,
      city: paymentInfo.city,
      district: paymentInfo.district,
      ward: paymentInfo.ward,
    };

    paymentInfo.address = address;

    try {
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
      clearInterval(timeoutRef.current);
      navigation.navigate("OrderSuccess"); // Chuyển hướng đến trang thành công
    } catch (error) {
      console.error("Error processing cart payment:", error);
      alert("Có lỗi xảy ra khi thanh toán giỏ hàng.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: currentUrl }}
        startInLoadingState={true}
        style={{ flex: 1 }}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        onNavigationStateChange={handleNavigationStateChange}
        renderLoading={() => (
          <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
        )}
      />
       <View style={{ position: "absolute", top: 60, left: 10, padding: 10, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 5, zIndex: 1, }}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{formatTime(timeLeft)}</Text>
      </View>
    </View>
    
  );
};
// Hàm định dạng thời gian
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};
export default ViewPayZalo;
