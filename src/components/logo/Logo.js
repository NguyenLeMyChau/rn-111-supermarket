import React from 'react';
import { StyleSheet, Image } from 'react-native';

import logo from '../../../assets/logo-supermarket-removebg.png';

export default function Logo({ width = 80, height = 80 }) {
    return (
        <Image
            source={logo}
            style={[styles.logo, { width, height }]}
        />
    );
}

const styles = StyleSheet.create({
    logo: {
        resizeMode: 'contain',
        backgroundColor: 'transparent',
        marginVertical: -30,
        alignSelf: 'center',
    },
});