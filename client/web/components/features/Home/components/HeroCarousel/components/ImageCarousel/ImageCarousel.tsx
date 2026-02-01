"use client"

import React from 'react'
    import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ImageItem {
    src: string
    alt: string
}

export interface ImageCarouselProps {
    images: ImageItem[]
    className?: string
}

export default function ImageCarousel({ images, className }: ImageCarouselProps) {
    // Calculate rotation angles for fan-out effect
    const getRotation = (index: number) => {
        const angles = [-20, -10, -5, 0, 5, 10, 20]
        return angles[index % angles.length]
    }

    // Calculate left offset for overlapping effect
    const getLeftOffset = (index: number) => {
        // Each image is offset by 80px to create overlap
        return index * 80
    }

    // Calculate z-index for proper stacking
    const getZIndex = (index: number, total: number) => {
        // Middle images have higher z-index
        const center = Math.floor(total / 2)
        const distanceFromCenter = Math.abs(index - center)
        return total - distanceFromCenter
    }

    return (
        <div className={cn("w-full overflow-x-auto py-8", className)}>
            {/* Desktop view with fan-out effect */}
            <div className="hidden md:flex justify-center items-center min-h-[400px] perspective-1000 relative mx-auto max-w-6xl px-4">
                {images.map((image, index) => {
                    const rotation = getRotation(index)
                    const leftOffset = getLeftOffset(index)
                    const zIndex = getZIndex(index, images.length)

                    return (
                        <Card
                            key={index}
                            className={cn(
                                "absolute rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-out hover:rotate-0 hover:scale-110 hover:z-50 cursor-pointer",
                                "w-[200px] h-[280px]"
                            )}
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                left: `${leftOffset}px`,
                                zIndex: zIndex,
                            }}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </Card>
                    )
                })}
            </div>

            {/* Mobile view with vertical stacking */}
            <div className="flex md:hidden flex-col items-center gap-4 px-4">
                {images.map((image, index) => (
                    <Card
                        key={index}
                        className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-out hover:scale-105 w-full max-w-sm"
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-auto aspect-[3/4] object-cover"
                            loading="lazy"
                        />
                    </Card>
                ))}
            </div>
        </div>
    )
}

