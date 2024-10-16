import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import colors from '../../constants/Color';
import { Picker } from '@react-native-picker/picker';
import { districts } from '../../util/address';

export default function UserInfo() {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth?.login?.currentUser.user);
    const isDisable = true;

    const [phone, setPhone] = useState(user?.phone || '');
    const [gender, setGender] = useState(user?.gender || false);
    const [name, setName] = useState(user?.name || '');
    const [city, setCity] = useState('Hồ Chí Minh');
    const [district, setDistrict] = useState(user?.address?.district || '');
    const [ward, setWard] = useState(user?.address?.ward || '');
    const [street, setStreet] = useState(user?.address?.street || '');
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
            handleDistrictChange(user?.address?.district);
            setWard(user?.address?.ward);
        }, [user])
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Thông tin khách hàng</Text>
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

            {/* Phone Number */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={isDisable ? { ...styles.inputFull, backgroundColor: '#f0f0f0' } : styles.inputFull}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    editable={!isDisable}
                />
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

            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditUserInfo')}>
                <Text style={styles.editButtonText}>Lưu chỉnh sửa</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%', // Full width for input
    },
    inputContainerShort: {
        marginBottom: 20,
        width: '42%', // Short input width
    },
    inputContainerShort2: {
        marginBottom: 20,
        width: '55%', // Short input width
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Align items horizontally
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
        height: 50, // Reduced height
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'medium'
    },
    inputFull: {
        width: '100%', // Full width input
        height: 50, // Reduced height
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

    editButton: {
        marginTop: 20,
        backgroundColor: colors.button,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
