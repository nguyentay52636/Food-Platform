import React, { useMemo } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../HomeScreen.styles';
import type { Place } from '../types';

type Props = {
    place: Place;
    index: number; // 1-based index hiển thị như "1."
    onPressPlace: (place: Place) => void;
};

export function PlaceSheet({ place, index, onPressPlace }: Props) {
    const headerIndex = useMemo(() => `${index}.`, [index]);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.placeSheet}
            onPress={() => onPressPlace(place)}
        >
            <View style={styles.placeHeaderRow}>
                <Text style={styles.placeIndex}>{headerIndex}</Text>
                <Text style={styles.placeName} numberOfLines={1}>
                    {place.name}
                </Text>
                <Text style={styles.placeDistance}>{place.distance}</Text>
            </View>

            <FlatList
                data={place.menu}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.menuListContent}
                renderItem={({ item }) => (
                    <View style={styles.menuCard}>
                        <Image
                            source={{ uri: place.thumbnail }}
                            style={styles.menuImage}
                        />
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuName} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={styles.menuRating}>
                                {item.rating.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                )}
            />
        </TouchableOpacity>
    );
}

