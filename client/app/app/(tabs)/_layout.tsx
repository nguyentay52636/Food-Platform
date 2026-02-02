import { Tabs } from 'expo-router'
import React from 'react'

import { IconSymbol } from '@/components/ui/icon-symbol'

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


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'none',
        tabBarInactiveTintColor: 'none',
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
            tabBarIcon: ({ focused }) => (
              <IconSymbol
                name={tab.icon}
                size={26}
                color={focused ? '#FF7A00' : '#9CA3AF'}
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
