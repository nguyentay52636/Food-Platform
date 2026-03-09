import React from "react"
import { StyleSheet, View } from "react-native"
import { FAB as PaperFAB } from "react-native-paper"
import { useTheme } from "react-native-paper"

type Props = {
  onPress: () => void
  icon?: string
}

export function FAB({ onPress, icon = "plus" }: Props) {
  const theme = useTheme()

  return (
    <View style={styles.container} pointerEvents="box-none">
      <PaperFAB
        icon={icon}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
        color={theme.colors.onPrimary}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    bottom: 24,
  },
  fab: {},
})
