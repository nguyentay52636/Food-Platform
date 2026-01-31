import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

type TabConfig = {
  name: string
  title: string
  icon: React.ComponentProps<typeof IconSymbol>['name']
}

const TABS: TabConfig[] = [
  {
    name: 'home',
    title: 'Home',
    icon: 'house.fill',
  },
  {
    name: 'library',
    title: 'Library',
    icon: 'books.vertical.fill',
  },
  {
    name: 'voice',
    title: 'Voice',
    icon: 'mic.fill',
  },
  {
    name: 'voucher',
    title: 'Voucher',
    icon: 'ticket.fill',
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: 'gearshape.fill',
  },
]

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const tintColor = Colors[colorScheme ?? 'light'].tint

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColor,
        tabBarButton: HapticTab,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <IconSymbol
                name={tab.icon}
                size={26}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
