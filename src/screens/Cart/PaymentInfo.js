import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/Color';
import { usePaymentModal } from '../../context/PaymentProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { districts } from '../../util/address';
import { Picker } from '@react-native-picker/picker';

const PaymentInfo = () => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth?.login?.currentUser.user);
    const { setIsInPaymentProcess, paymentInfo, setPaymentInfo } = usePaymentModal();

    // Sử dụng paymentInfo nếu có, nếu không sử dụng thông tin từ user
    const [phone, setPhone] = useState(paymentInfo?.phone || user?.phone || '');
    const [gender, setGender] = useState(paymentInfo?.gender || user?.gender || false);
    const [name, setName] = useState(paymentInfo?.name || user?.name || '');
    const [city, setCity] = useState('Hồ Chí Minh');
    const [district, setDistrict] = useState(paymentInfo?.district || '');
    const [ward, setWard] = useState(paymentInfo?.ward || '');
    const [street, setStreet] = useState(paymentInfo?.street || '');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [wards, setWards] = useState([]);

    const handleDistrictChange = (itemValue) => {
        setDistrict(itemValue);
        const selectedDistrict = districts.find(d => d.name === itemValue);
        console.log(selectedDistrict);
        setWards(selectedDistrict ? selectedDistrict.wards : []);
        setWard('');
    };

    useFocusEffect(
        useCallback(() => {
            if (!paymentInfo) {
                handleDistrictChange(user?.address?.district);
                setWard(user?.address?.ward);
                setStreet(user?.address?.street);
            } else {
                handleDistrictChange(paymentInfo.district);
                setWard(paymentInfo.ward);
                setStreet(paymentInfo.street);
            }
        }, [user])
    );

    useEffect(() => {
        // Kiểm tra nếu tất cả các trường đều được điền đầy đủ và số điện thoại hợp lệ
        const phoneRegex = /^[0-9]{10,11}$/; // Chỉ chấp nhận số từ 10-11 ký tự
        const isPhoneValid = phoneRegex.test(phone);

        if (phone && isPhoneValid && gender !== '' && name && district && ward && street) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [phone, gender, name, district, ward, street]);

    const handleSubmit = () => {
        setPaymentInfo({
            phone,
            gender,
            name,
            city,
            district,
            ward,
            street,
        });
        setIsInPaymentProcess(true);
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    setIsInPaymentProcess(true);
                    navigation.goBack();
                }}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Thông tin nhận hàng</Text>
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={styles.inputFull}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            {/* Gender */}
            <View style={styles.genderContainer}>
                <View style={styles.radioGroup}>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setGender(false)}
                    >
                        <View style={styles.radioCircle}>
                            {gender === false && <View style={styles.selectedRb} />}
                        </View>
                        <Text style={styles.radioText}>Nam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setGender(true)}
                    >
                        <View style={styles.radioCircle}>
                            {gender === true && <View style={styles.selectedRb} />}
                        </View>
                        <Text style={styles.radioText}>Nữ</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Full Name */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput
                    style={styles.inputFull}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            {/* City and District */}
            <View style={styles.rowContainer}>
                <View style={styles.inputContainerShort}>
                    <Text style={styles.label}>Thành phố</Text>
                    <TextInput
                        style={styles.input}
                        value={city}
                        editable={false}
                    />
                </View>

                <View style={styles.inputContainerShort2}>
                    <Text style={styles.label}>Quận/Huyện</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={district}
                            style={styles.input}
                            onValueChange={handleDistrictChange}
                        >
                            <Picker.Item label="Chọn" value="" />
                            {districts.map((districtItem, index) => (
                                <Picker.Item key={index} label={districtItem.name} value={districtItem.name} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>

            {/* Ward */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phường/Xã</Text>
                <View style={styles.pickerContainer}>

                    <Picker
                        selectedValue={ward}
                        style={styles.inputFull}
                        onValueChange={(itemValue) => setWard(itemValue)}
                    >
                        <Picker.Item label="Chọn phường/xã" value="" />
                        {wards.map((wardItem, index) => (
                            <Picker.Item key={index} label={wardItem} value={wardItem} />
                        ))}
                    </Picker>
                </View>
            </View>

            {/* Address */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Số nhà, tên đường</Text>
                <TextInput
                    style={styles.inputFull}
                    value={street}
                    onChangeText={setStreet}
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isButtonDisabled}
            >
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%', // Chiều rộng full cho ô nhập liệu
    },
    inputContainerShort: {
        marginBottom: 20,
        width: '40%', // Short input width
    },
    inputContainerShort2: {
        marginBottom: 20,
        width: '57%', // Short input width
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Căn chỉnh các ô ngang
    },
    label: {
        position: 'absolute',
        left: 10,
        top: -10,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 5,
        fontSize: 13,
        fontWeight: '400',
        color: 'gray',
        zIndex: 1,  // Thêm thuộc tính zIndex
    },
    input: {
        height: 50, // Chiều cao giảm
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'medium',
    },
    inputFull: {
        width: '100%', // Chiều rộng ô nhập liệu
        height: 50, // Chiều cao giảm
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'medium'
    },
    genderContainer: {
        marginBottom: 20,
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 30,
        marginBottom: 10
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007BFF',
    },
    radioText: {
        fontSize: 16,
        color: '#000',
    },
    button: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: colors.button,
    },
    buttonDisabled: {
        backgroundColor: '#A9A9A9',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PaymentInfo;
