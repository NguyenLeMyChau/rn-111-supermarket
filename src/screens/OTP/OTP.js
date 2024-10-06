import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import colors from '../../constants/Color';

const CELL_COUNT = 6;
const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.8;
const CELL_WIDTH = BUTTON_WIDTH / CELL_COUNT;

const OTP = ({ navigation }) => {
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const handleConfirmCode = () => {
        // Xử lý xác nhận mã OTP
        if (value === '123456') {
            Alert.alert('Success', 'OTP is correct!');
            // Điều hướng đến màn hình tiếp theo
            navigation.navigate('NextScreen');
        } else {
            Alert.alert('Error', 'OTP is incorrect!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>NHẬP OTP</Text>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <View
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        <Text style={styles.cellText}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={handleConfirmCode}>
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        marginBottom: 30,
        fontWeight: 'bold',
        color: colors.title,
    },
    codeFieldRoot: {
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: BUTTON_WIDTH,
    },
    cell: {
        width: CELL_WIDTH,
        height: 60,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#dfe1e5',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cellText: {
        fontSize: 24,
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#007BFF',
        shadowColor: '#007BFF',
        shadowOpacity: 0.8,
    },
    button: {
        width: BUTTON_WIDTH,
        backgroundColor: colors.button,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OTP;