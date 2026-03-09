import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "react-native-paper"
import type { POICategory, MinorSubCategory } from "@/src/types/poi"
import { SUB_CATEGORY_LABELS } from "@/src/lib/poi-utils"

const MINOR_OPTIONS: MinorSubCategory[] = ["wc", "ticket", "parking", "dock"]

type Props = {
  category: POICategory
  subCategory: MinorSubCategory | undefined
  onCategoryChange: (c: POICategory) => void
  onSubCategoryChange: (s: MinorSubCategory) => void
}

export function POICategoryPicker({
  category,
  subCategory,
  onCategoryChange,
  onSubCategoryChange,
}: Props) {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Category
      </Text>
      <View style={styles.segmented}>
        <TouchableOpacity
          style={[
            styles.segment,
            category === "major" && {
              backgroundColor: theme.colors.primary,
            },
            category !== "major" && {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
          onPress={() => onCategoryChange("major")}
        >
          <Text
            style={[
              styles.segmentText,
              { color: category === "major" ? theme.colors.onPrimary : theme.colors.onSurfaceVariant },
            ]}
          >
            Major
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            category === "minor" && {
              backgroundColor: theme.colors.primary,
            },
            category !== "minor" && {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
          onPress={() => onCategoryChange("minor")}
        >
          <Text
            style={[
              styles.segmentText,
              { color: category === "minor" ? theme.colors.onPrimary : theme.colors.onSurfaceVariant },
            ]}
          >
            Minor
          </Text>
        </TouchableOpacity>
      </View>

      {category === "minor" && (
        <View style={styles.subSection}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Subcategory
          </Text>
          <View style={styles.subGrid}>
            {MINOR_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.subChip,
                  {
                    backgroundColor:
                      subCategory === opt
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                  },
                ]}
                onPress={() => onSubCategoryChange(opt)}
              >
                <Text
                  style={[
                    styles.subChipText,
                    {
                      color:
                        subCategory === opt
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {SUB_CATEGORY_LABELS[opt] ?? opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
  segmented: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "500",
  },
  subSection: {
    marginTop: 16,
  },
  subGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
})
