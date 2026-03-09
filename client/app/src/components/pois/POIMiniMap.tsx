import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { useTheme } from "react-native-paper"

const MAP_HEIGHT = 200

type Props = {
  latitude: number
  longitude: number
  title?: string
  onViewFullMap: () => void
}

const DELTA = 0.008

export function POIMiniMap({
  latitude,
  longitude,
  title,
  onViewFullMap,
}: Props) {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: DELTA,
          longitudeDelta: DELTA,
        }}
        scrollEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
        />
      </MapView>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onViewFullMap}
      >
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
          View Full Map
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: MAP_HEIGHT + 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  map: {
    height: MAP_HEIGHT,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
})
