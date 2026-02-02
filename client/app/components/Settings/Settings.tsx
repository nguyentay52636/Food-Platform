import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import { SECTIONS } from './data';

export default function Settings() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.headerIconButton}>
                        <Ionicons name="chevron-back" size={20} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.headerIconButton}>
                        <Ionicons name="ellipsis-horizontal" size={18} color="#111827" />
                    </TouchableOpacity>
                </View>

                {/* Profile */}
                <View style={styles.profileRow}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarInitials}>VK</Text>
                    </View>
                    <View style={styles.profileText}>
                        <Text style={styles.profileName}>Tay Nguyen</Text>
                        <Text style={styles.profileSubtitle}>I love street food</Text>
                    </View>
                </View>

                {/* Sections */}
                {SECTIONS.map((section) => (
                    <View key={section.id} style={styles.sectionCard}>
                        {section.items.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.row,
                                    index !== section.items.length - 1 && styles.rowDivider,
                                ]}
                            >
                                <View style={styles.rowLeft}>
                                    <View style={styles.iconCircle}>
                                        <Ionicons name={item.icon as any} size={18} color="#FF7A00" />
                                    </View>
                                    <Text style={styles.rowLabel}>{item.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                            </View>
                        ))}
                    </View>
                ))}

                {/* Logout */}
                <View style={styles.sectionCard}>
                    <TouchableOpacity
                        style={styles.row}
                        activeOpacity={0.9}
                        onPress={() => router.replace('/(auth)/login')}
                    >
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconCircle, styles.iconCircleDanger]}>
                                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                            </View>
                            <Text style={[styles.rowLabel, styles.logoutLabel]}>Log Out</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },
    scroll: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerIconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFE6CC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarInitials: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF7A00',
    },
    profileText: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    rowDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E7EB',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF2E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconCircleDanger: {
        backgroundColor: '#FEE2E2',
    },
    rowLabel: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
    },
    logoutLabel: {
        color: '#EF4444',
    },
});
