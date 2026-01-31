import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoginFooterProps {
    promptText?: string;
    linkText?: string;
    route?: string;
}

export const LoginFooter = ({
    promptText = "Don't have an account? ",
    linkText = "Sign Up",
    route = "/auth/signup"
}: LoginFooterProps) => {
    const router = useRouter();

    return (
        <View style={styles.footer}>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-apple" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>{promptText}</Text>
                <TouchableOpacity onPress={() => router.push(route as any)}>
                    <Text style={styles.signupLink}>{linkText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        alignItems: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E1E1E1',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#999',
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 32,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E1E1E1',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signupText: {
        color: '#666',
        fontSize: 14,
    },
    signupLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
