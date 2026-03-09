import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Appbar, useTheme } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

import { createPOI, updatePOI, fetchPOI } from "@/src/lib/api"
import { setMapPickerListener } from "@/src/lib/mapPickerStore"
import { POIImagePicker } from "@/src/components/pois/POIImagePicker"
import { POICategoryPicker } from "@/src/components/pois/POICategoryPicker"
import { POILocationPicker } from "@/src/components/pois/POILocationPicker"
import type { CreatePOIPayload, POICategory, MinorSubCategory } from "@/src/types/poi"
import * as Location from "expo-location"

type FormState = {
  imageUri: string | null
  name: string
  description: string
  address: string
  category: POICategory
  subCategory: MinorSubCategory | undefined
  latitude: number
  longitude: number
}

const initialForm: FormState = {
  imageUri: null,
  name: "",
  description: "",
  address: "",
  category: "major",
  subCategory: undefined,
  latitude: 0,
  longitude: 0,
}

function getErrors(form: FormState): Record<string, string> {
  const err: Record<string, string> = {}
  if (!form.name.trim()) err.name = "Name is required"
  if (form.category === "minor" && !form.subCategory) err.subCategory = "Select a subcategory"
  if (form.latitude === 0 && form.longitude === 0) err.location = "Pick a location on the map"
  return err
}

export default function POIFormScreen() {
  const theme = useTheme()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<FormState>(initialForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)

  const errors = getErrors(form)
  const isValid = Object.keys(errors).length === 0

  const loadPoi = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const poi = await fetchPOI(id)
      setForm({
        imageUri: poi.imageUrl ?? null,
        name: poi.name,
        description: poi.description ?? "",
        address: poi.address ?? "",
        category: poi.category,
        subCategory: poi.subCategory,
        latitude: poi.latitude,
        longitude: poi.longitude,
      })
    } catch {
      setForm(initialForm)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPoi()
  }, [loadPoi])

  useEffect(() => {
    const unsub = setMapPickerListener((lat, lng) => {
      setForm((f) => ({ ...f, latitude: lat, longitude: lng }))
    })
    return () => {
      setMapPickerListener(null)
    }
  }, [])

  const update = useCallback((patch: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...patch }))
  }, [])

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  const handlePickImage = useCallback(async () => {
    try {
      const { launchImageLibraryAsync } = await import("expo-image-picker")
      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
      })
      if (!result.canceled && result.assets[0]) {
        update({ imageUri: result.assets[0].uri })
      }
    } catch {
      // expo-image-picker not installed: show placeholder behavior or alert
      update({ imageUri: "https://placehold.co/400x300?text=Photo" })
    }
  }, [update])

  const handlePickOnMap = useCallback(() => {
    router.push({
      pathname: "/poi/map-picker",
      params: {
        lat: form.latitude || undefined,
        lng: form.longitude || undefined,
      },
    } as any)
  }, [router, form.latitude, form.longitude])

  const handleUseCurrentLocation = useCallback(async () => {
    setLocating(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission needed", "Location permission is required.")
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      update({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
    } catch {
      Alert.alert("Error", "Could not get current location.")
    } finally {
      setLocating(false)
    }
  }, [update])

  const handleSave = useCallback(async () => {
    if (!isValid || saving) return
    setSaving(true)
    try {
      const payload: CreatePOIPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        address: form.address.trim() || undefined,
        category: form.category,
        subCategory: form.subCategory,
        latitude: form.latitude,
        longitude: form.longitude,
        imageUrl: form.imageUri || undefined,
      }
      if (isEdit && id) {
        await updatePOI(id, payload)
        router.back()
      } else {
        await createPOI(payload)
        router.back()
      }
    } catch {
      Alert.alert("Error", "Failed to save.")
    } finally {
      setSaving(false)
    }
  }, [form, isValid, saving, isEdit, id, router])

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Action icon="close" onPress={handleClose} />
        <Appbar.Content
          title={isEdit ? "Edit Location" : "Add Location"}
        />
        <Appbar.Action
          icon="content-save"
          onPress={handleSave}
          disabled={!isValid || saving}
        />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <POIImagePicker imageUri={form.imageUri} onPickImage={handlePickImage} />

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: theme.colors.onSurface, borderColor: errors.name ? theme.colors.error : theme.colors.outline },
              ]}
              value={form.name}
              onChangeText={(t) => update({ name: t })}
              placeholder="Location name"
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            {errors.name ? (
              <Text style={[styles.error, { color: theme.colors.error }]}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Description
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { color: theme.colors.onSurface }]}
              value={form.description}
              onChangeText={(t) => update({ description: t })}
              placeholder="Description (3–4 lines)"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Address
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              value={form.address}
              onChangeText={(t) => update({ address: t })}
              placeholder="Address"
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
          </View>

          <POICategoryPicker
            category={form.category}
            subCategory={form.subCategory}
            onCategoryChange={(c) => update({ category: c, subCategory: undefined })}
            onSubCategoryChange={(s) => update({ subCategory: s })}
          />

          <POILocationPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onPickOnMap={handlePickOnMap}
            onUseCurrentLocation={handleUseCurrentLocation}
            onMarkerDragEnd={(lat, lng) => update({ latitude: lat, longitude: lng })}
            isLocating={locating}
          />
          {errors.location ? (
            <Text style={[styles.error, { color: theme.colors.error, marginHorizontal: 16 }]}>
              {errors.location}
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  field: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
})
