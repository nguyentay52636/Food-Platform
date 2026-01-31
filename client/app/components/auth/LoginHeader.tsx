import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LoginHeaderProps {
    title?: string;
    subtitle?: string;
}

export const LoginHeader = ({
    title = "Chào mừng trở lại",
    subtitle = "Đăng nhập để tiếp tục kết nối với bạn bè."
}: LoginHeaderProps) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 24,
    },
});
