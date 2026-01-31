import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginFooter } from '@/components/auth/LoginFooter';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginHeader } from '@/components/auth/LoginHeader';

export default function Login() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.contentContainer}>
                        <LoginHeader />

                        <LoginForm
                            identifier={identifier}
                            setIdentifier={setIdentifier}
                            password={password}
                            setPassword={setPassword}
                            isPasswordVisible={isPasswordVisible}
                            setIsPasswordVisible={setIsPasswordVisible}
                            isLoading={false}
                            onLogin={() => { }}
                        />

                        <LoginFooter />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    keyboardView: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingBottom: 40,
    },
});
