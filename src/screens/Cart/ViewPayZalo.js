import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  AppState,
  View,
  Alert,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import WebView from "react-native-webview";
import { checkPaymentStatus, payCart } from "../../services/cartRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";

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
  } = route.params;

  const [currentUrl, setCurrentUrl] = useState(url);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isModalVisible, setModalVisible] = useState(false);
  const [qrData, setQrData] = useState(""); // Dữ liệu QR cho ZaloPay
  const appState = useRef(AppState.currentState);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    startTimeout();
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

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
    }, 1000);
  };

  const handleTimeout = () => {
    clearInterval(timeoutRef.current);
    Alert.alert("Thông báo", "Phiên thanh toán đã hết hạn. Vui lòng thử lại.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App returned to foreground");
      setCurrentUrl(url);
      setLoading(true);
      checkPaymentStatusPay();
    }
    appState.current = nextAppState;
  };

  const handleNavigationStateChange = (navState) => {
    // If URL has changed, reset it to the original URL
    if (navState.url !== currentUrl) {
      setCurrentUrl(url);
    }
  };

  const checkPaymentStatusPay = async () => {
    const responseCheck = await checkPaymentStatus(axiosJWT, app_trans_id);
    if (responseCheck.return_message === "Giao dịch thành công") {
      handlePayCart(app_trans_id);
    } else {
      Alert.alert("Thông báo", "Giao dịch chưa được thực hiện");
      setCurrentUrl(url); // Ensure it resets to the original URL if payment is not successful
      setLoading(false);
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
      setLoading(false);
      // navigation.navigate("OrderSuccess");
    } catch (error) {
      console.error("Error processing cart payment:", error);
      Alert.alert("Sự cố", "Có lỗi xảy ra khi thanh toán giỏ hàng.");
      setLoading(false);
    }
  };

  const showQrModal = () => {
    // Giả sử dữ liệu QR bạn muốn hiển thị cho ZaloPay (ví dụ: URL thanh toán ZaloPay hoặc mã QR)
    setQrData(url); // Dữ liệu QR cần truyền vào
    setModalVisible(true);
  };

  const hideQrModal = () => {
    setModalVisible(false);
    checkPaymentStatusPay(); // Check payment status when QR modal is closed
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
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        )}
      />

      <Button title="Quét QR thanh toán ZaloPay" onPress={showQrModal} />

      {/* Modal hiển thị QR thanh toán */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <Text style={{ marginBottom: 20 }}>QR thanh toán ZaloPay</Text>
          {/* <QRCode value={url} size={250} /> */}
          <TouchableOpacity
            onPress={hideQrModal}
            style={{
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 5,
              margin:30,
            }}
            disabled={loading} // Disable khi loading
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              {loading ? "Đang kiểm tra giao dịch..." : "Xác nhận"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default ViewPayZalo;
