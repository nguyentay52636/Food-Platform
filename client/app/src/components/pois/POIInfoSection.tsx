import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native"
import { useTheme } from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import type { POI } from "@/src/types/poi"
import { formatCoordinatesFull } from "@/src/lib/poi-utils"

type Props = {
  poi: POI
}

export function POIInfoSection({ poi }: Props) {
  const theme = useTheme()
  const [coordinatesExpanded, setCoordinatesExpanded] = useState(false)

  const mapsUrl = Platform.select({
    ios: `maps:?q=${encodeURIComponent(poi.address || `${poi.latitude},${poi.longitude}`)}`,
    default: `https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`,
  })

  const openMaps = () => {
    Linking.openURL(mapsUrl)
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.name, { color: theme.colors.onSurface }]}>
        {poi.name}
      </Text>

      {poi.rating != null && poi.rating > 0 && (
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <MaterialIcons
              key={i}
              name={i <= Math.round(poi.rating!) ? "star" : "star-border"}
              size={20}
              color={theme.colors.primary}
            />
          ))}
          <Text style={[styles.reviewCount, { color: theme.colors.onSurfaceVariant }]}>
            {poi.reviewCount != null && poi.reviewCount > 0
              ? `${poi.reviewCount} reviews`
              : ""}
          </Text>
        </View>
      )}

      {(poi.address || mapsUrl) && (
        <View style={styles.addressBlock}>
          <View style={styles.addressRow}>
            <MaterialIcons
              name="location-on"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.address, { color: theme.colors.onSurface }]}>
              {poi.address || "No address"}
            </Text>
          </View>
          <TouchableOpacity onPress={openMaps} style={styles.mapsLink}>
            <Text style={[styles.mapsLinkText, { color: theme.colors.primary }]}>
              Open in Maps
            </Text>
            <MaterialIcons name="open-in-new" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setCoordinatesExpanded((e) => !e)}
        style={styles.coordsRow}
      >
        <MaterialIcons
          name={coordinatesExpanded ? "expand-less" : "expand-more"}
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
        <Text style={[styles.coordsLabel, { color: theme.colors.onSurfaceVariant }]}>
          Coordinates
        </Text>
      </TouchableOpacity>
      {coordinatesExpanded && (
        <Text style={[styles.coordsValue, { color: theme.colors.onSurfaceVariant }]}>
          {formatCoordinatesFull(poi.latitude, poi.longitude)}
        </Text>
      )}

      <Text style={[styles.description, { color: theme.colors.onSurface }]}>
        {poi.description || "No description."}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  reviewCount: {
    fontSize: 13,
    marginLeft: 4,
  },
  addressBlock: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  address: {
    flex: 1,
    fontSize: 15,
  },
  mapsLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  mapsLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  coordsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  coordsLabel: {
    fontSize: 14,
  },
  coordsValue: {
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
})
