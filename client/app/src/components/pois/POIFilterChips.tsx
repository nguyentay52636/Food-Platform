import React from "react"
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import type { POIFilterCategory } from "@/src/types/poi"

const CHIPS: { value: POIFilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
]

type Props = {
  selected: POIFilterCategory
  onSelect: (value: POIFilterCategory) => void
}

export function POIFilterChips({ selected, onSelect }: Props) {
  const theme = useTheme()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {CHIPS.map((chip) => {
        const isSelected = chip.value === selected
        return (
          <TouchableOpacity
            key={chip.value}
            onPress={() => onSelect(chip.value)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected
                    ? theme.colors.onPrimary
                    : theme.colors.onSurfaceVariant,
                },
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 32,
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
})
