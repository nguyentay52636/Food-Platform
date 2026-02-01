"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SliderNavigationProps {
    currentIndex: number
    totalSlides: number
    onPrevious: () => void
    onNext: () => void
    onSlideClick: (index: number) => void
    isAnimating: boolean
}

export default function SliderNavigation({
    currentIndex,
    totalSlides,
    onPrevious,
    onNext,
    onSlideClick,
    isAnimating
}: SliderNavigationProps) {
    return (
        <div className="flex justify-center items-center gap-4 mt-8">
            <button
                onClick={onPrevious}
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Previous image"
                disabled={isAnimating}
            >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Slider Track */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <motion.button
                        key={index}
                        onClick={() => onSlideClick(index)}
                        className={`relative ${index === currentIndex
                            ? 'bg-primary'
                            : 'bg-gray-300 hover:bg-gray-400'
                            } transition-colors duration-300 rounded-full cursor-pointer`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                            width: index === currentIndex ? '32px' : '8px',
                            height: '8px'
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                        disabled={isAnimating}
                    />
                ))}
            </div>

            <button
                onClick={onNext}
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Next image"
                disabled={isAnimating}
            >
                <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
        </div>
    )
}

