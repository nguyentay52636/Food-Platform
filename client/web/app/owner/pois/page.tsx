"use client"

import { useSearchParams } from "next/navigation"
import { OwnerPois } from "@/components/features/owner/components/Pois/OwnerPois"

export default function OwnerPoisPage() {
  const searchParams = useSearchParams()
  const ownerId = searchParams.get("ownerId") ?? "owner-1"

  return <OwnerPois ownerId={ownerId} />
}

