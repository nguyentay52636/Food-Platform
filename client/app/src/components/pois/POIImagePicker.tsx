import React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

const PLACEHOLDER_SIZE = 120

type Props = {
  imageUri: string | null
  onPickImage: () => void
}

export function POIImagePicker({ imageUri, onPickImage }: Props) {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPickImage}
        style={[styles.box, { backgroundColor: theme.colors.surfaceVariant }]}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <>
            <MaterialIcons
              name="add-a-photo"
              size={40}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.placeholderText, { color: theme.colors.onSurfaceVariant }]}>
              Add photo
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  box: {
    width: PLACEHOLDER_SIZE,
    height: PLACEHOLDER_SIZE,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 13,
  },
})
