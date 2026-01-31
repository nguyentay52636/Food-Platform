import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface LoginFormProps {
    identifier: string;
    setIdentifier: (text: string) => void;
    password: string;
    setPassword: (text: string) => void;
    isPasswordVisible: boolean;
    setIsPasswordVisible: (visible: boolean) => void;
    isLoading: boolean;
    onLogin: () => void;
    buttonTitle?: string;
    loadingTitle?: string;
}

export const LoginForm = ({
    identifier,
    setIdentifier,
    password,
    setPassword,
    isPasswordVisible,
    setIsPasswordVisible,
    onLogin,
    buttonTitle = "Đăng nhập",
    loadingTitle = "Đang đăng nhập..."
}: LoginFormProps) => {
    return (
        <View style={styles.form}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Số điện thoại hoặc email</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số điện thoại hoặc email"
                        placeholderTextColor="#999"
                        value={identifier}
                        onChangeText={setIdentifier}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={onLogin}
            >
                <Text style={styles.loginButtonText}>
                    {buttonTitle}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E1E1E1',
        height: 56,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
