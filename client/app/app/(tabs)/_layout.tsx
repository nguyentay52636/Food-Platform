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
    name: 'expore',
    title: 'Khám phá',
    icon: 'house.fill',
  },
  {
    name: 'library',
    title: 'Thư viện',
    icon: 'books.vertical.fill',
  },
  {
    name: 'voice',
    title: 'Tạo mới',
    icon: 'mic.fill',
  },
  {
    name: 'voucher',
    title: 'Mã',
    icon: 'ticket.fill',
  },
  {
    name: 'settings',
    title: 'Cài đặt',
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
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
        },
        tabBarStyle: {
          height: 88,
          paddingBottom: 20,
          paddingTop: 8,
          borderTopWidth: 0.5,
          borderTopColor: '#E1E1E1',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
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
                style={{
                  width: 26,
                  height: 26,
                }}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
