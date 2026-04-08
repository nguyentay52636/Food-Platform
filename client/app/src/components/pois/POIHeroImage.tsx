import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import type { POI } from "@/src/types/poi"
import { getSubCategoryLabel } from "@/src/lib/poi-utils"

const HERO_HEIGHT = 220

type Props = {
  poi: POI
}

export function POIHeroImage({ poi }: Props) {
  const theme = useTheme()

  const categoryLabel =
    poi.category === "major" ? "Điểm chính" : getSubCategoryLabel(poi.subCategory)

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      {poi.imageUrl ? (
        <Image
          source={{ uri: poi.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialIcons
            name="place"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      )}

      <View style={[styles.badgeCategory, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>
          {categoryLabel}
        </Text>
      </View>

      {poi.rating != null && poi.rating > 0 && (
        <View style={[styles.badgeRating, { backgroundColor: theme.colors.secondaryContainer }]}>
          <MaterialIcons name="star" size={16} color={theme.colors.onSecondaryContainer} />
          <Text style={[styles.ratingText, { color: theme.colors.onSecondaryContainer }]}>
            {poi.rating.toFixed(1)}
            {poi.reviewCount != null && poi.reviewCount > 0 && ` (${poi.reviewCount})`}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: HERO_HEIGHT,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeCategory: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeRating: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
  },
})
