"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export interface CardSliderItemProps {
    image: { src: string; alt: string }
    index: number
    currentIndex: number
    totalCards: number
    onClick: () => void
    onDragEnd: (e: MouseEvent | TouchEvent | PointerEvent, info: any) => void
}

export default function CardSliderItem({
    image,
    index,
    currentIndex,
    totalCards,
    onClick,
    onDragEnd
}: CardSliderItemProps) {
    const offset = index - currentIndex
    const normalizedOffset = offset > totalCards / 2
        ? offset - totalCards
        : offset < -totalCards / 2
            ? offset + totalCards
            : offset

    const absOffset = Math.abs(normalizedOffset)

    const rotation = normalizedOffset * 10
    const leftOffset = normalizedOffset * 140
    const zIndex = totalCards - absOffset

    const scale = Math.max(0.2, 1 - absOffset * 0.1)
    const opacity = Math.max(0.7, 1 - absOffset * 0.14)
    const shadowIntensity = Math.max(0.5, 1 - absOffset * 0.2)

    return (
        <div className="mx-auto" key={`card-${index}`}>
            <motion.div
                layout
                initial={false}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                    left: `calc(40% + ${leftOffset}px)`,
                    transform: 'translateX(-50%)',
                    transformStyle: 'preserve-3d',
                    zIndex,
                }}
                whileHover={{
                    rotateY: 0,
                    scale: 1.12,
                    z: 60,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }
                }}
                animate={{
                    rotateY: rotation,
                    scale: scale,
                    opacity: opacity,
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1,
                    duration: 0.8
                }}
                onClick={onClick}
                onDragEnd={onDragEnd}
                drag="x"
                dragConstraints={{ left: -200, right: 200 }}
                dragElastic={0.3}
            >
                <Card
                    className="overflow-hidden rounded-[30px] border-0 bg-white"
                    style={{
                        width: '260px',
                        height: '400px',
                        boxShadow: `
              0 ${12 * shadowIntensity}px ${40 * shadowIntensity}px rgba(0,0,0,${0.25 * shadowIntensity}),
              0 ${6 * shadowIntensity}px ${20 * shadowIntensity}px rgba(0,0,0,${0.15 * shadowIntensity}),
              inset 0 1px 0 rgba(255,255,255,0.5)
            `,
                    }}
                >
                    <img
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        loading={absOffset <= 2 ? "eager" : "lazy"}
                        style={{
                            borderRadius: '36px',
                        }}
                    />
                    {/* Highlight effect */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            borderRadius: '36px',
                            background: `radial-gradient(ellipse at top, rgba(255,255,255,${0.3 * shadowIntensity}) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
                        }}
                    />
                </Card>
            </motion.div>
        </div>
    )
}

