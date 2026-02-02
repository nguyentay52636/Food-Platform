import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../HomeScreen.styles';

type Props = {
    active: 'map' | 'list';
    onChange?: (next: 'map' | 'list') => void;
};

export function ModeToggle({ active, onChange }: Props) {
    return (
        <View style={styles.modeToggle}>
            <TouchableOpacity
                style={[
                    styles.modeButton,
                    active === 'map' ? styles.modeButtonActive : null,
                ]}
                onPress={() => onChange?.('map')}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.modeButtonText,
                        active === 'map' ? styles.modeButtonTextActive : null,
                    ]}
                >
                    Map
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.modeButton,
                    active === 'list' ? styles.modeButtonActive : null,
                ]}
                onPress={() => onChange?.('list')}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.modeButtonText,
                        active === 'list' ? styles.modeButtonTextActive : null,
                    ]}
                >
                    List
                </Text>
            </TouchableOpacity>
        </View>
    );
}

