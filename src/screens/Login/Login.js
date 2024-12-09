import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import colors from "../../constants/Color";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../services/authRequest";

import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import TouchableOpacityForm from "../../components/button/TouchableOpacityForm";
import { usePaymentModal } from "../../context/PaymentProvider";
import Logo from "../../components/logo/Logo";
const { width, height } = Dimensions.get("window");
export default function Login() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { setPaymentInfo } = usePaymentModal();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading

  // Xử lý đăng nhập với phone và password
  const handleLogin = async () => {
    // Kiểm tra ràng buộc số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/; // Kiểm tra số điện thoại chỉ chứa từ 10 đến 11 chữ số
    if (!phoneRegex.test(phone)) {
      Alert.alert('Lỗi', "Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      setIsLoading(false); // Dừng quá trình đăng nhập
      return;
    }

    // Kiểm tra ràng buộc mật khẩu
    const passwordRegex = /^[a-zA-Z0-9]{6,}$/; // Chỉ chứa chữ cái và số, ít nhất 6 ký tự
    if (!passwordRegex.test(password)) {
      Alert.alert('Lỗi', "Mật khẩu phải có ít nhất 6 ký tự và không chứa ký tự đặc biệt.");
      setIsLoading(false); // Dừng quá trình đăng nhập
      return;
    }

    // Nếu tất cả ràng buộc hợp lệ, thực hiện đăng nhập
    setIsLoading(true); // Bắt đầu quá trình đăng nhập
    const loginData = {
      phone: phone,
      password: password,
    };
    await loginUser(loginData, dispatch, navigation);
    setPaymentInfo(null);
    setIsLoading(false); // Kết thúc quá trình đăng nhập
  };


  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>CAPY SMART</Text>
        <Logo width={width * 0.9} height={height * 0.3} />
      </View>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>

      <Input
        Icon={Fontisto}
        nameIcon={"phone"}
        placeholder={"Số điện thoại"}
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

      <Input
        Icon={AntDesign}
        nameIcon={"lock"}
        placeholder={"Mật khẩu"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        IconEnd={Feather}
        nameIconEnd={showPassword ? "eye" : "eye-off"}
        onPressIconEnd={() => setShowPassword(!showPassword)}
      />

      <TouchableOpacity style={styles.forgotPass}>
        <Text style={{ color: colors.title }}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button TextValue={"Đăng Nhập"} onPress={handleLogin} />
      )}

      <TouchableOpacityForm
        TextBegin={"Bạn chưa có tài khoản?"}
        TextValue={"Đăng ký"}
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    color: colors.title,
  },
  forgotPass: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  logo: {
    marginBottom: 16,
    padding: 10,
  },
});
