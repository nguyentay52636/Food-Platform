"use client"

import "leaflet/dist/leaflet.css"

import { useEffect, useMemo, useState } from "react"
import { IRestaurant } from "@/app/apis/type"

type LeafletComponents = {
  MapContainer: any
  TileLayer: any
  Marker: any
  Popup: any
  ZoomControl: any
  L: any
}

const createCustomIcon = (L: any, isSelected: boolean, isLive: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${isSelected ? "#f39c12" : "#8b5cf6"};
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        border: 4px solid white;
        position: relative;
        transition: all 0.3s ease;
        ${isSelected ? "transform: scale(1.4); z-index: 1000;" : ""}
        cursor: pointer;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        ${
          isLive
            ? `<div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: #ef4444;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(239,68,68,0.6);
          animation: pulse-live 2s infinite;
        "></div>
        <style>
          @keyframes pulse-live {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.6; }
          }
        </style>`
            : ""
        }
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  })
}

export function useMaps(restaurants: IRestaurant[], selectedRestaurant: number | null) {
  const [isClient, setIsClient] = useState(false)
  const [leafletComponents, setLeafletComponents] = useState<LeafletComponents | null>(null)

  useEffect(() => {
    setIsClient(true)
    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default
      const { MapContainer, TileLayer, Marker, Popup, ZoomControl } = await import("react-leaflet")
      setLeafletComponents({
        MapContainer,
        TileLayer,
        Marker,
        Popup,
        ZoomControl,
        L,
      })
    }
    loadLeaflet()
  }, [])

  const center = useMemo<[number, number]>(() => {
    if (!restaurants.length) return [10.7769, 106.6951]
    const lat = restaurants.reduce((sum: number, r: IRestaurant) => sum + r.lat, 0) / restaurants.length
    const lng = restaurants.reduce((sum: number, r: IRestaurant) => sum + r.lng, 0) / restaurants.length
    return [lat, lng]
  }, [restaurants])

  const markerIcons = useMemo<
    Record<number, { default: any; selected: any }>
  >(() => {
    if (!leafletComponents) return {}
    const { L } = leafletComponents

    const icons: Record<number, { default: any; selected: any }> = {}
    restaurants.forEach((r) => {
      icons[r.id] = {
        default: createCustomIcon(L, false, r.isLive),
        selected: createCustomIcon(L, true, r.isLive),
      }
    })
    return icons
  }, [leafletComponents, restaurants])

  const getMarkerIcon = (restaurant: IRestaurant) => {
    if (!leafletComponents) return undefined
    const iconVariant = selectedRestaurant === restaurant.id ? "selected" : "default"
    return (
      markerIcons[restaurant.id]?.[iconVariant] ??
      createCustomIcon(
        leafletComponents.L,
        selectedRestaurant === restaurant.id,
        restaurant.isLive
      )
    )
  }

  return {
    isReady: isClient && !!leafletComponents,
    leafletComponents,
    center,
    getMarkerIcon,
  }
}

