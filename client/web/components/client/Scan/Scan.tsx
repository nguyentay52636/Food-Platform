"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { X, Flashlight, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/context/language-context"
import { useVisitorSession } from "@/lib/context/visitor-session"
import { CLIENT_MOCK_POIS, CLIENT_MOCK_TOURS } from "@/lib/client-mock-data"

export default function Scan() {
    const router = useRouter()
    const { t } = useLanguage()
    const visitor = useVisitorSession()
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [scanning, setScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                })
                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    await videoRef.current.play()
                }
                setHasPermission(true)
                setScanning(true)
            } catch {
                setHasPermission(false)
                setError("Camera permission denied")
            }
        }

        startCamera()

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    // Simulate QR detection (in real app, use a QR library like jsQR)
    const handleSimulateQRScan = (type: "poi" | "tour") => {
        setScanning(false)

        if (type === "poi") {
            const randomPoi = CLIENT_MOCK_POIS[Math.floor(Math.random() * 3)]
            // Track QR entry source for anonymous visitor session
            visitor.setEntrySource("qr_code", randomPoi.id)
            visitor.trackPageView("qr_scan", { type: "poi", poiId: randomPoi.id })
            router.push(`/poi/${randomPoi.id}`)
        } else {
            const randomTour = CLIENT_MOCK_TOURS[0]
            // Track QR entry source for anonymous visitor session
            visitor.setEntrySource("qr_code", randomTour.id)
            visitor.trackPageView("qr_scan", { type: "tour", tourId: randomTour.id })
            router.push(`/tours/${randomTour.id}`)
        }
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <X className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-white font-semibold">{t.qr.title}</h1>
                <div className="w-10" />
            </div>

            {/* Camera View */}
            <div className="flex-1 relative overflow-hidden">
                {hasPermission === false ? (
                    <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
                        <Camera className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Camera Access Required</p>
                        <p className="text-sm opacity-70 mb-6">
                            Please allow camera access to scan QR codes
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            {t.common.retry}
                        </Button>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            muted
                        />

                        {/* Scan Frame Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Darkened corners */}
                            <div className="absolute inset-0 bg-black/50" />

                            {/* Clear scan area */}
                            <div className="relative w-64 h-64">
                                <div className="absolute inset-0 bg-black/50 -m-[9999px] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_0,9999px_9999px,9999px_calc(100%+9999px),calc(100%+9999px)_calc(100%+9999px),calc(100%+9999px)_9999px,9999px_9999px)]" />

                                {/* Corner markers */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />

                                {/* Scanning line animation */}
                                {scanning && (
                                    <div className="absolute left-2 right-2 h-0.5 bg-primary animate-scan" />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-safe">
                <p className="text-white text-center text-sm mb-6 opacity-80">
                    {t.qr.instructions}
                </p>

                {/* Demo buttons (for testing without real QR) */}
                <div className="flex gap-3 mb-4">
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleSimulateQRScan("poi")}
                    >
                        Demo: Scan POI
                    </Button>
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleSimulateQRScan("tour")}
                    >
                        Demo: Scan Tour
                    </Button>
                </div>

                <Link href="/" className="block">
                    <Button variant="ghost" className="w-full text-white hover:bg-white/20">
                        {t.qr.skip}
                    </Button>
                </Link>
            </div>

            {/* Scanning line animation styles */}
            <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 8px; }
          50% { top: calc(100% - 8px); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        .pb-safe {
          padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
        }
      `}</style>
        </div>
    )
}
