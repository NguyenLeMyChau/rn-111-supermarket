import React, { createContext, useContext, useState } from 'react';

// Tạo context
const PaymentModalContext = createContext();

// Tạo provider
export const PaymentModalProvider = ({ children }) => {
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [isInPaymentProcess, setIsInPaymentProcess] = useState(false); // Quản lý trạng thái quá trình thanh toán
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const [previousCart, setPreviousCart] = useState(null);


    return (
        <PaymentModalContext.Provider value={{
            isPaymentModalVisible,
            setPaymentModalVisible,
            paymentInfo,
            setPaymentInfo,
            promoCode,
            setPromoCode,
            paymentMethod,
            setPaymentMethod,
            isInPaymentProcess,
            setIsInPaymentProcess,
            previousCart,
            setPreviousCart
        }}>
            {children}
        </PaymentModalContext.Provider>
    );
};

// Hook để sử dụng context
export const usePaymentModal = () => useContext(PaymentModalContext);