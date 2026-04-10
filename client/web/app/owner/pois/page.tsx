"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { OwnerPois } from "@/components/features/owner/components/Pois/OwnerPois"

function OwnerPoisContent() {
  const searchParams = useSearchParams()
  const ownerId = searchParams.get("ownerId") ?? "owner-1"

  return <OwnerPois ownerId={ownerId} />
}

export default function OwnerPoisPage() {
  return (
    <Suspense fallback={null}>
      <OwnerPoisContent />
    </Suspense>
  )
}

