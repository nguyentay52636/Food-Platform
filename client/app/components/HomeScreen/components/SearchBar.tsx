import React from 'react';
import { TextInput, View } from 'react-native';
import { styles } from '../HomeScreen.styles';

type Props = {
    value: string;
    onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: Props) {
    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm quán ăn, cà phê..."
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}

