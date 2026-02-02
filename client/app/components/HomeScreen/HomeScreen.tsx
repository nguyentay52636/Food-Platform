import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

type MenuItem = {
    id: string;
    name: string;
    rating: number;
};

type Place = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: 'food' | 'coffee' | 'other';
    rating: number;
    distance: string;
    thumbnail: string;
    menu: MenuItem[];
};

const INITIAL_REGION: Region = {
    latitude: 10.7552,
    longitude: 106.7058,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

const PLACES: Place[] = [
    {
        id: '1',
        name: 'Quán Ốc Vĩnh Khánh',
        address: 'Vĩnh Khánh, Quận 4, TP. HCM',
        latitude: 10.7556,
        longitude: 106.7052,
        category: 'food',
        rating: 8.5,
        distance: '0.3 km',
        thumbnail: 'https://images.pexels.com/photos/3298180/pexels-photo-3298180.jpeg',
        menu: [
            { id: 'm1', name: 'Ốc len xào dừa', rating: 9.0 },
            { id: 'm2', name: 'Sò điệp nướng mỡ hành', rating: 8.8 },
            { id: 'm3', name: 'Ngao hấp xả', rating: 8.7 },
        ],
    },
    {
        id: '2',
        name: 'Quán Nướng Vĩnh Khánh',
        address: 'Vĩnh Khánh, Quận 4, TP. HCM',
        latitude: 10.7549,
        longitude: 106.7061,
        category: 'food',
        rating: 8.9,
        distance: '0.5 km',
        thumbnail: 'https://images.pexels.com/photos/4106483/pexels-photo-4106483.jpeg',
        menu: [
            { id: 'm4', name: 'Ba rọi nướng tảng', rating: 9.1 },
            { id: 'm5', name: 'Bạch tuộc nướng sa tế', rating: 8.9 },
            { id: 'm6', name: 'Đùi gà nướng mật ong', rating: 8.6 },
        ],
    },
    {
        id: '3',
        name: 'Cà phê Vĩnh Khánh',
        address: 'Vĩnh Khánh, Quận 4, TP. HCM',
        latitude: 10.7558,
        longitude: 106.707,
        category: 'coffee',
        rating: 8.2,
        distance: '0.4 km',
        thumbnail: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
        menu: [
            { id: 'm7', name: 'Cà phê sữa đá', rating: 8.8 },
            { id: 'm8', name: 'Bạc xỉu', rating: 8.5 },
            { id: 'm9', name: 'Trà đào cam sả', rating: 8.7 },
        ],
    },
];

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

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm quán ăn, cà phê..."
                        placeholderTextColor="#999"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.modeToggle}>
                        <TouchableOpacity style={[styles.modeButton, styles.modeButtonActive]}>
                            <Text style={[styles.modeButtonText, styles.modeButtonTextActive]}>
                                Map
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modeButton}>
                            <Text style={styles.modeButtonText}>List</Text>
                        </TouchableOpacity>
                    </View>

                    {!!selectedPlace && (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.placeSheet}
                            onPress={() => handlePressPlace(selectedPlace)}
                        >
                            <View style={styles.placeHeaderRow}>
                                <Text style={styles.placeIndex}>
                                    {filteredPlaces.findIndex((p) => p.id === selectedPlace.id) + 1}.
                                </Text>
                                <Text style={styles.placeName} numberOfLines={1}>
                                    {selectedPlace.name}
                                </Text>
                                <Text style={styles.placeDistance}>{selectedPlace.distance}</Text>
                            </View>

                            <FlatList
                                data={selectedPlace.menu}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.menuListContent}
                                renderItem={({ item }) => (
                                    <View style={styles.menuCard}>
                                        <Image
                                            source={{ uri: selectedPlace.thumbnail }}
                                            style={styles.menuImage}
                                        />
                                        <View style={styles.menuTextContainer}>
                                            <Text style={styles.menuName} numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.menuRating}>{item.rating.toFixed(1)}</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mapContainer: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listContainer: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    modeToggle: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 4,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    modeButton: {
        flex: 1,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    modeButtonText: {
        fontSize: 13,
        color: '#666666',
        fontWeight: '500',
    },
    modeButtonTextActive: {
        color: '#111111',
        fontWeight: '600',
    },
    placeSheet: {
        width: '92%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    placeHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    placeIndex: {
        fontSize: 16,
        fontWeight: '700',
        marginRight: 4,
    },
    placeName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    placeDistance: {
        fontSize: 13,
        color: '#666666',
        marginLeft: 8,
    },
    menuListContent: {
        paddingTop: 4,
    },
    menuCard: {
        width: 140,
        marginRight: 8,
    },
    menuImage: {
        width: '100%',
        height: 70,
        borderRadius: 8,
    },
    menuTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    menuName: {
        fontSize: 13,
        color: '#666666',
        flex: 1,
        marginRight: 4,
    },
    menuRating: {
        fontSize: 13,
        fontWeight: '600',
        color: '#E84A5F',
    },
});