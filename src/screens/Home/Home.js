import { StyleSheet, Text, View } from "react-native";
import TouchableOpacityForm from "../../components/button/TouchableOpacityForm";


export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <TouchableOpacityForm TextBegin="Welcome to" TextValue="Home" onPress={() => { }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});