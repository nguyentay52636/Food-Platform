import React, { useState, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native"
import { useRouter } from "expo-router"
import { Appbar, useTheme } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import { usePOIs } from "@/src/hooks/usePOIs"
import { POICard } from "@/src/components/pois/POICard"
import { POISearchBar } from "@/src/components/pois/POISearchBar"
import { POIFilterChips } from "@/src/components/pois/POIFilterChips"
import { FAB } from "@/src/components/common/FAB"
import type { POI } from "@/src/types/poi"

function EmptyState() {
  const theme = useTheme()

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIllustration,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <MaterialIcons
          name="location-off"
          size={80}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        No locations yet
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        Tap + to add your first POI
      </Text>
    </View>
  )
}

export default function POIListScreen() {
  const theme = useTheme()
  const router = useRouter()
  const [searchVisible, setSearchVisible] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)

  const {
    pois,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    refresh,
    loadMore,
  } = usePOIs()

  const handleSearchPress = useCallback(() => {
    setSearchVisible(true)
  }, [])

  const handleFilterPress = useCallback(() => {
    setFilterVisible(true)
  }, [])

  const handleFilterSelect = useCallback((value: typeof filterCategory) => {
    setFilterCategory(value)
    setFilterVisible(false)
  }, [setFilterCategory])

  const handlePOIPress = useCallback(
    (poi: POI) => {
      router.push(`/poi/${poi.id}`)
    },
    [router]
  )

  const handleEdit = useCallback(
    (poi: POI) => {
      router.push(`/poi/${poi.id}/edit`)
    },
    [router]
  )

  const handleDelete = useCallback((poi: POI) => {
    // TODO: Show delete confirmation, call deletePOI
  }, [])

  const handleAddPOI = useCallback(() => {
    router.push("/poi/add")
  }, [router])

  const renderItem = useCallback(
    ({ item }: { item: POI }) => (
      <POICard
        poi={item}
        distanceKm={null}
        onPress={() => handlePOIPress(item)}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item)}
      />
    ),
    [handlePOIPress, handleEdit, handleDelete]
  )

  const keyExtractor = useCallback((item: POI) => item.id, [])

  const ListFooterComponent = useCallback(() => {
    if (!isLoadingMore || !hasMore) return null
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    )
  }, [isLoadingMore, hasMore, theme.colors.primary])

  if (isLoading && pois.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.Content title="Locations" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <Appbar.Header
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Appbar.Content title="Locations" titleStyle={styles.title} />
        <Appbar.Action icon="magnify" onPress={handleSearchPress} />
        <Appbar.Action icon="filter-variant" onPress={handleFilterPress} />
      </Appbar.Header>

      <POISearchBar
        visible={searchVisible}
        value={search}
        onChangeText={setSearch}
        onClose={() => setSearchVisible(false)}
      />

      <POIFilterChips
        selected={filterCategory}
        onSelect={setFilterCategory}
      />

      <FlatList
        data={pois}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          pois.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={EmptyState}
        ListFooterComponent={ListFooterComponent}
      />

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterVisible(false)}
        >
          <Pressable
            style={[styles.filterSheet, { backgroundColor: theme.colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.filterHandle} />
            <Text style={[styles.filterTitle, { color: theme.colors.onSurface }]}>
              Filter by category
            </Text>
            <View style={styles.filterChips}>
              {(["all", "major", "minor"] as const).map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor:
                        filterCategory === value
                          ? theme.colors.primary
                          : theme.colors.surfaceVariant,
                    },
                  ]}
                  onPress={() => handleFilterSelect(value)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      {
                        color:
                          filterCategory === value
                            ? theme.colors.onPrimary
                            : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <FAB onPress={handleAddPOI} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
  },
  listContent: {
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIllustration: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  filterSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  filterHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  filterChips: {
    flexDirection: "column",
  },
  filterChip: {
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    marginBottom: 12,
                  },
  filterChipText: {
    fontSize: 16,
    fontWeight: "500",
  },
})
