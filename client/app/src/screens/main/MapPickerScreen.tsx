import React, { useState, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useTheme } from "react-native-paper"
import MapView, { Region } from "react-native-maps"
import { SafeAreaView } from "react-native-safe-area-context"

import { confirmMapPickerLocation } from "@/src/lib/mapPickerStore"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const DELTA = 0.01

export default function MapPickerScreen() {
  const theme = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams<{
    lat?: string
    lng?: string
  }>()

  const initialLat = params.lat ? parseFloat(params.lat) : 16.06
  const initialLng = params.lng ? parseFloat(params.lng) : 108.22

  const [region, setRegion] = useState<Region>({
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  })

  const handleConfirm = useCallback(() => {
    confirmMapPickerLocation(region.latitude, region.longitude)
    router.back()
  }, [region, router])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.colors.surface }]}
          placeholder="Search place..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          editable={false}
        />
      </View>

      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
      />

      <View style={styles.crosshair} pointerEvents="none">
        <View style={[styles.crosshairLine, styles.crosshairH]} />
        <View style={[styles.crosshairLine, styles.crosshairV]} />
      </View>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.coordsText, { color: theme.colors.onSurfaceVariant }]}>
          {region.latitude.toFixed(6)}, {region.longitude.toFixed(6)}
        </Text>
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleConfirm}
        >
          <Text style={[styles.confirmButtonText, { color: theme.colors.onPrimary }]}>
            Confirm Location
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  map: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  crosshair: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 52,
  },
  crosshairLine: {
    position: "absolute",
    backgroundColor: "rgba(255,0,0,0.6)",
  },
  crosshairH: {
    width: 24,
    height: 2,
  },
  crosshairV: {
    width: 2,
    height: 24,
  },
  footer: {
    padding: 16,
  },
  coordsText: {
    fontSize: 12,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})
