import React, { useEffect, useRef } from "react"
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Keyboard,
  Platform,
} from "react-native"
import { useTheme } from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

type Props = {
  visible: boolean
  value: string
  onChangeText: (text: string) => void
  onClose: () => void
}

export function POISearchBar({ visible, value, onChangeText, onClose }: Props) {
  const theme = useTheme()
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      Keyboard.dismiss()
    }
  }, [visible])

  if (!visible) return null

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.row}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialIcons name="search" size={22} color={theme.colors.onSurfaceVariant} />
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: theme.colors.onSurface }]}
            placeholder="Search locations..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={() => onChangeText("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="close" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
  },
})
