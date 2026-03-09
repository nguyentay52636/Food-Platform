import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Appbar, useTheme } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import { fetchPOI, deletePOI } from "@/src/lib/api"
import { POIHeroImage } from "@/src/components/pois/POIHeroImage"
import { POIInfoSection } from "@/src/components/pois/POIInfoSection"
import { POIMiniMap } from "@/src/components/pois/POIMiniMap"
import type { POI } from "@/src/types/poi"

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export default function POIDetailScreen() {
  const theme = useTheme()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [poi, setPoi] = useState<POI | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionSheetVisible, setActionSheetVisible] = useState(false)

  const loadPoi = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await fetchPOI(id)
      setPoi(data)
    } catch {
      setPoi(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPoi()
  }, [loadPoi])

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleEdit = useCallback(() => {
    if (id) router.push(`/poi/${id}/edit`)
  }, [router, id])

  const handleDelete = useCallback(() => {
    if (!poi) return
    Alert.alert(
      "Delete Location",
      `Delete "${poi.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePOI(poi.id)
              router.back()
            } catch {
              Alert.alert("Error", "Failed to delete.")
            }
          },
        },
      ]
    )
    setActionSheetVisible(false)
  }, [poi, router])

  const handleShare = useCallback(() => {
    // Placeholder: use Share API or deep link
    setActionSheetVisible(false)
  }, [])

  const handleViewFullMap = useCallback(() => {
    if (!poi) return
    const url =
      Platform.OS === "ios"
        ? `maps:?q=${poi.latitude},${poi.longitude}`
        : `https://www.google.com/maps?q=${poi.latitude},${poi.longitude}`
    Linking.openURL(url)
  }, [poi])

  const handleEditLocation = useCallback(() => {
    handleEdit()
  }, [handleEdit])

  const handleBottomDelete = useCallback(() => {
    handleDelete()
  }, [handleDelete])

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Loading..." />
        </Appbar.Header>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (!poi) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Not found" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text style={{ color: theme.colors.onSurface }}>POI not found.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={poi.name} titleNumberOfLines={1} />
        <Appbar.Action icon="pencil" onPress={handleEdit} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => setActionSheetVisible(true)}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <POIHeroImage poi={poi} />
        <POIInfoSection poi={poi} />
        <POIMiniMap
          latitude={poi.latitude}
          longitude={poi.longitude}
          title={poi.name}
          onViewFullMap={handleViewFullMap}
        />

        <View style={[styles.metadata, { borderTopColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}>
            Created
          </Text>
          <Text style={[styles.metaValue, { color: theme.colors.onSurface }]}>
            {formatDate(poi.createdAt)}
          </Text>
          <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}>
            Updated
          </Text>
          <Text style={[styles.metaValue, { color: theme.colors.onSurface }]}>
            {formatDate(poi.updatedAt)}
          </Text>
          <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}>
            ID
          </Text>
          <Text style={[styles.metaValue, { color: theme.colors.onSurface }]}>
            {poi.id}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.surfaceVariant }]}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleEditLocation}
        >
          <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>
            Edit Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.destructiveButton, { borderColor: theme.colors.error }]}
          onPress={handleBottomDelete}
        >
          <Text style={[styles.destructiveButtonText, { color: theme.colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <Pressable
          style={styles.actionSheetOverlay}
          onPress={() => setActionSheetVisible(false)}
        >
          <View style={[styles.actionSheet, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete" size={24} color={theme.colors.error} />
              <Text style={[styles.actionText, { color: theme.colors.error }]}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleShare}
            >
              <MaterialIcons name="share" size={24} color={theme.colors.onSurface} />
              <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionItem, styles.actionItemCancel]}
              onPress={() => setActionSheetVisible(false)}
            >
              <Text style={[styles.actionText, { color: theme.colors.onSurfaceVariant }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  metadata: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    marginBottom: 12,
  },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  destructiveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  destructiveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionSheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  actionSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  actionItemCancel: {
    marginTop: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
  },
})
