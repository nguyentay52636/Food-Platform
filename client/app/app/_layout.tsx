import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'
import 'react-native-reanimated'

import { ThemeProvider as CustomThemeProvider, useTheme } from '@/app/context/ThemeContext'

export const unstable_settings = {
  anchor: '(tabs)',
}

function AppLayout() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <PaperProvider theme={isDark ? MD3DarkTheme : MD3LightTheme}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="chat/[id]"
            options={{ headerShown: true }}
          />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </ThemeProvider>
    </PaperProvider>
  )
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AppLayout />
    </CustomThemeProvider>
  )
}
