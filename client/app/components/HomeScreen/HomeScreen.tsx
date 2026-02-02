import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModeToggle } from './components/ModeToggle';
import { PlaceSheet } from './components/PlaceSheet';
import { SearchBar } from './components/SearchBar';
import { INITIAL_REGION, PLACES } from './data';
import { styles } from './HomeScreen.styles';
import type { Place } from './types';

export default function HomeScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState<Region>(INITIAL_REGION);
    const [selectedPlace, setSelectedPlace] = useState<Place>(PLACES[0]);

    const filteredPlaces = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return PLACES;

        return PLACES.filter((place) =>
            place.name.toLowerCase().includes(keyword)
        );
    }, [search]);

    const handlePressPlace = (place: Place) => {
        // TODO: Khi có PlaceDetailScreen, thay '/(tabs)' bằng đường dẫn chi tiết, ví dụ '/place/[id]'
        router.push('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={INITIAL_REGION}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    showsUserLocation
                >
                    {filteredPlaces.map((place) => (
                        <Marker
                            key={place.id}
                            onPress={() => setSelectedPlace(place)}
                            coordinate={{
                                latitude: place.latitude,
                                longitude: place.longitude,
                            }}
                            title={place.name}
                            description={place.address}
                        />
                    ))}
                </MapView>

                <SearchBar value={search} onChangeText={setSearch} />

                <View style={styles.listContainer}>
                    <ModeToggle active="map" />

                    {!!selectedPlace && (
                        <PlaceSheet
                            place={selectedPlace}
                            index={
                                filteredPlaces.findIndex((p) => p.id === selectedPlace.id) + 1
                            }
                            onPressPlace={handlePressPlace}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}