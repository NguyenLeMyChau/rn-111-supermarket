import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CountdownModal = ({ closeModal }) => {
 
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút = 900 giây

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleRetryPayment = () => {
    alert('Thanh toán lại!');
    // Thêm logic thanh toán ở đây
  };

  const handleCancelPayment = () => {
    alert('Hủy thanh toán!');
  
    closeModal();
  };

  const handleCheckPaymentStatus = () => {
    alert('Kiểm tra trạng thái thanh toán!');
    // Thêm logic kiểm tra trạng thái ở đây
  };

  return (
   
         <Modal visible transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.description}>
              Vui lòng thanh toán trong thời gian còn lại.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={handleRetryPayment}
              >
                <Text style={styles.buttonText}>Thanh toán lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelPayment}
              >
                <Text style={styles.buttonText}>Hủy thanh toán</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.checkStatusButton]}
              onPress={handleCheckPaymentStatus}
            >
              <Text style={styles.buttonText}>Kiểm tra trạng thái</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  checkStatusButton: {
    backgroundColor: '#2196F3',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CountdownModal;
