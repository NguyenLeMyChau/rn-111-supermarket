import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Support() {
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleChatPress = () => {
        // Điều hướng đến màn hình chat hoặc hiển thị modal chat
        navigation.navigate('Chat'); // Giả sử bạn đã có màn hình Chat
    };

    const handleToggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const faqs = [
        {
            question: 'Làm thế nào để đặt hàng?',
            answer: 'Bạn có thể đặt hàng trực tuyến thông qua trang web hoặc ứng dụng di động của chúng tôi. Chọn sản phẩm bạn muốn mua, thêm vào giỏ hàng và tiến hành thanh toán.',
        },
        {
            question: 'Phương thức thanh toán nào được chấp nhận?',
            answer: 'Chúng tôi chấp nhận các phương thức thanh toán như thẻ tín dụng, thẻ ghi nợ, chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD).',
        },
        {
            question: 'Tôi có thể hủy đơn hàng không?',
            answer: 'Bạn có thể hủy đơn hàng trước khi đơn hàng được xử lý và giao hàng. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để được hỗ trợ hủy đơn hàng.',
        },
        {
            question: 'Làm thế nào để theo dõi đơn hàng của tôi?',
            answer: 'Sau khi đặt hàng, bạn sẽ nhận được một email xác nhận với thông tin theo dõi đơn hàng. Bạn cũng có thể theo dõi đơn hàng thông qua tài khoản của mình trên trang web hoặc ứng dụng di động.',
        },
        {
            question: 'Tôi có thể đổi trả hàng không?',
            answer: 'Chúng tôi chấp nhận đổi trả hàng trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và có đầy đủ hóa đơn mua hàng.',
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Hỗ trợ</Text>
            </View>
            <Text style={styles.paragraph}>
                Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua các kênh sau:
            </Text>
            <Text style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email: </Text>
                support@capysmart.com
            </Text>
            <Text style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Số điện thoại: </Text>
                0123 456 789
            </Text>
            <Text style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Địa chỉ: </Text>
                123 Đường ABC, Quận 1, TP. Hồ Chí Minh
            </Text>
            <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
                <Text style={styles.chatButtonText}>Nhắn tin trực tiếp</Text>
            </TouchableOpacity>
            <Text style={styles.faqTitle}>Câu hỏi thường gặp</Text>
            {faqs.map((faq, index) => (
                <View key={index} style={styles.faqContainer}>
                    <TouchableOpacity onPress={() => handleToggle(index)} style={styles.faqQuestionContainer}>
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                        <Icon name={expandedIndex === index ? 'expand-less' : 'expand-more'} size={24} color="#333" />
                    </TouchableOpacity>
                    {expandedIndex === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        color: '#555',
        textAlign: 'justify',
    },
    contactInfo: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
        color: '#555',
    },
    contactLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    chatButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    chatButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    faqTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    faqContainer: {
        marginBottom: 16,
    },
    faqQuestionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    faqAnswer: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
});