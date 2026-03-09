import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native"
import MapView, { Marker } from "react-native-maps"
import { useTheme } from "react-native-paper"

const MAP_HEIGHT = 160
const DELTA = 0.008
const DEFAULT_LAT = 16.06
const DEFAULT_LNG = 108.22

type Props = {
  latitude: number
  longitude: number
  onPickOnMap: () => void
  onUseCurrentLocation: () => void
  onMarkerDragEnd?: (lat: number, lng: number) => void
  isLocating?: boolean
}

export function POILocationPicker({
  latitude,
  longitude,
  onPickOnMap,
  onUseCurrentLocation,
  onMarkerDragEnd,
  isLocating = false,
}: Props) {
  const theme = useTheme()

  const hasLocation = !(latitude === 0 && longitude === 0)
  const latStr = hasLocation ? latitude.toFixed(6) : ""
  const lngStr = hasLocation ? longitude.toFixed(6) : ""
  const mapLat = latitude || DEFAULT_LAT
  const mapLng = longitude || DEFAULT_LNG

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Location
      </Text>

      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: mapLat,
            longitude: mapLng,
            latitudeDelta: DELTA,
            longitudeDelta: DELTA,
          }}
          region={{
            latitude: mapLat,
            longitude: mapLng,
            latitudeDelta: DELTA,
            longitudeDelta: DELTA,
          }}
          scrollEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{ latitude: mapLat, longitude: mapLng }}
            draggable
            onDragEnd={(e) =>
              onMarkerDragEnd?.(
                e.nativeEvent.coordinate.latitude,
                e.nativeEvent.coordinate.longitude
              )
            }
          />
        </MapView>
      </View>

      <TouchableOpacity
        style={[styles.mapButton, { backgroundColor: theme.colors.primary }]}
        onPress={onPickOnMap}
      >
        <Text style={[styles.mapButtonText, { color: theme.colors.onPrimary }]}>
          Pick on Map
        </Text>
      </TouchableOpacity>

      <View style={styles.coordsRow}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>
            Latitude
          </Text>
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            value={latStr}
            editable={false}
            placeholder="—"
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>
            Longitude
          </Text>
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            value={lngStr}
            editable={false}
            placeholder="—"
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.currentButton, { backgroundColor: theme.colors.surfaceVariant }]}
        onPress={onUseCurrentLocation}
        disabled={isLocating}
      >
        <Text
          style={[
            styles.currentButtonText,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {isLocating ? "Getting location…" : "Use Current Location"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  mapWrap: {
    height: MAP_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  coordsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  currentButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  currentButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
})
