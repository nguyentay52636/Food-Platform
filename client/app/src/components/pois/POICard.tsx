import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native"
import { useTheme } from "react-native-paper"
import Swipeable from "react-native-gesture-handler/Swipeable"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import type { POI } from "@/src/types/poi"
import { getSubCategoryLabel } from "@/src/lib/poi-utils"

type Props = {
  poi: POI
  distanceKm?: number | null
  onPress: () => void
  onEdit: () => void
  onDelete: () => void
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CARD_WIDTH = SCREEN_WIDTH - 32
const ACTION_WIDTH = 80

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

function LeftActions({
  onEdit,
  theme,
}: {
  onEdit: () => void
  theme: ReturnType<typeof useTheme>
}) {
  return (
    <TouchableOpacity
      style={[styles.action, styles.leftAction, { backgroundColor: theme.colors.tertiary }]}
      onPress={onEdit}
    >
      <MaterialIcons name="edit" size={24} color={theme.colors.onTertiary} />
      <Text style={[styles.actionText, { color: theme.colors.onTertiary }]}>Edit</Text>
    </TouchableOpacity>
  )
}

function RightActions({
  onDelete,
  theme,
}: {
  onDelete: () => void
  theme: ReturnType<typeof useTheme>
}) {
  return (
    <TouchableOpacity
      style={[styles.action, styles.rightAction, { backgroundColor: theme.colors.error }]}
      onPress={onDelete}
    >
      <MaterialIcons name="delete" size={24} color={theme.colors.onError} />
      <Text style={[styles.actionText, { color: theme.colors.onError }]}>Delete</Text>
    </TouchableOpacity>
  )
}

export function POICard({ poi, distanceKm, onPress, onEdit, onDelete }: Props) {
  const theme = useTheme()

  const categoryLabel =
    poi.category === "major" ? "Major" : getSubCategoryLabel(poi.subCategory)

  return (
    <Swipeable
      renderLeftActions={() => (
        <LeftActions onEdit={onEdit} theme={theme} />
      )}
      renderRightActions={() => (
        <RightActions onDelete={onDelete} theme={theme} />
      )}
      friction={2}
      leftThreshold={ACTION_WIDTH * 0.5}
      rightThreshold={ACTION_WIDTH * 0.5}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.thumbnail}>
          {poi.imageUrl ? (
            <Image
              source={{ uri: poi.imageUrl }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.placeholder,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <MaterialIcons
                name="place"
                size={32}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.name, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {poi.name}
            </Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    poi.category === "major"
                      ? theme.colors.primaryContainer
                      : theme.colors.secondaryContainer,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      poi.category === "major"
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSecondaryContainer,
                  },
                ]}
              >
                {categoryLabel}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {poi.description || "No description"}
          </Text>

          {poi.address ? (
            <View style={styles.addressRow}>
              <MaterialIcons
                name="location-on"
                size={16}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.address, { color: theme.colors.onSurfaceVariant }]}
                numberOfLines={1}
              >
                {poi.address}
              </Text>
            </View>
          ) : null}

          {distanceKm != null && distanceKm >= 0 ? (
            <View
              style={[
                styles.distanceBadge,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Text
                style={[
                  styles.distanceText,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {formatDistance(distanceKm)}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 100,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  address: {
    flex: 1,
    fontSize: 12,
  },
  distanceBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "500",
  },
  action: {
    width: ACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  leftAction: {
    marginLeft: 12,
  },
  rightAction: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
})
