import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon

export default function About() {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Giới thiệu về Capy Smart</Text>
            </View>
            <Text style={styles.paragraph}>
                Capy Smart là siêu thị hiện đại, mang đến trải nghiệm mua sắm tiện lợi và thông minh cho khách hàng. Với sứ mệnh cung cấp các sản phẩm chất lượng cao, từ thực phẩm, dược phẩm đến các sản phẩm tiêu dùng hàng ngày, Capy Smart cam kết đáp ứng mọi nhu cầu của bạn với giá cả hợp lý và dịch vụ chu đáo.
            </Text>
            <Text style={styles.paragraph}>
                Tại Capy Smart, khách hàng có thể dễ dàng tìm kiếm và lựa chọn sản phẩm thông qua các kệ hàng được sắp xếp khoa học. Chúng tôi không chỉ chú trọng đến chất lượng sản phẩm mà còn đem lại trải nghiệm mua sắm thân thiện và an toàn. Đặc biệt, với hệ thống thanh toán tự động và dịch vụ giao hàng tận nơi, Capy Smart giúp khách hàng tiết kiệm thời gian và tối ưu hoá việc mua sắm.
            </Text>
            <Text style={styles.paragraph}>
                Capy Smart – nơi bạn tin tưởng cho những lựa chọn tiêu dùng thông minh, mang đến sự tiện ích và chất lượng ngay trong tầm tay.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        marginRight: 8,
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
});