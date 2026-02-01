"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CardSliderItem, SliderNavigation } from './components'
import { useTranslation } from '@/app/context/TranslationContext'

const heroImages = [
    { src: "/img/pho-bowl.jpg", alt: "Phở Bò" },
    { src: "/img/banh-mi-sandwich.jpg", alt: "Bánh Mì" },
    { src: "/img/com-tam-rice.jpg", alt: "Cơm Tấm" },
    { src: "/img/bun-bo-hue.png", alt: "Bún Bò Huế" },
    { src: "/img/hu-tieu.jpg", alt: "Hủ Tiếu" },
    { src: "/img/mi-quang.jpg", alt: "Mì Quảng" },
    { src: "/img/restaurant-1.jpg", alt: "Nhà hàng Sài Gòn" },
    { src: "/img/restaurant-2.jpg", alt: "Quán ăn vỉa hè" },
    { src: "/img/restaurant-2.jpg", alt: "Quán ăn vỉa hè" },
]

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setIsAnimating(true)
                setCurrentIndex((prev) => (prev + 1) % heroImages.length)
                setTimeout(() => setIsAnimating(false), 800)
            }, 5000)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isPaused])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0
        }
    }

    return (
        <section
            className="relative overflow-hidden"

        >
            <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
                <motion.div
                    className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-balance leading-tight"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        variants={itemVariants}
                    >
                        {t('hero.discoverSaigonFlavor')}
                    </motion.h1>

                    <motion.p
                        className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-600"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        variants={itemVariants}
                    >
                        {t('hero.culinaryJourney')}
                    </motion.p>

                </motion.div>

                <motion.div
                    className="mb-8 relative"
                    variants={itemVariants}
                >


                    <div
                        className="w-full relative h-[500px] md:h-[450px] overflow-visible"
                        style={{
                            perspective: '1500px',
                            perspectiveOrigin: 'center center',
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="w-full h-full relative">
                            {heroImages.map((image, index) => (
                                <CardSliderItem
                                    key={index}
                                    image={image}
                                    index={index}
                                    currentIndex={currentIndex}
                                    totalCards={heroImages.length}
                                    onClick={() => setCurrentIndex(index)}
                                    onDragEnd={(e: any, info: any) => {
                                        const dragDelta = info.offset.x
                                        if (Math.abs(dragDelta) > 50) {
                                            if (dragDelta > 0) {
                                                setCurrentIndex((prev) => (prev + 1) % heroImages.length)
                                            } else {
                                                setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        <SliderNavigation
                            currentIndex={currentIndex}
                            totalSlides={heroImages.length}
                            onPrevious={() => {
                                setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
                                setIsAnimating(true)
                                setTimeout(() => setIsAnimating(false), 800)
                            }}
                            onNext={() => {
                                setCurrentIndex((prev) => (prev + 1) % heroImages.length)
                                setIsAnimating(true)
                                setTimeout(() => setIsAnimating(false), 800)
                            }}
                            onSlideClick={(index) => {
                                setCurrentIndex(index)
                                setIsAnimating(true)
                                setTimeout(() => setIsAnimating(false), 800)
                            }}
                            isAnimating={isAnimating}
                        />
                    </div>

                </motion.div>
            </div>
            <motion.div variants={itemVariants} >
                <div className="flex justify-center mb-12 md:mb-16">
                    <Button
                        asChild
                        size="lg"
                        className=" py-8 text-xl rounded-full px-2 mx-2! hover:bg-primary/90!"
                        style={{
                            backgroundColor: '#C9482B',
                            color: 'white'
                        }}
                        onMouseEnter={() => { }}
                    >
                        <Link href="/explore">
                            {t('hero.discoverNow')}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </motion.div>

            <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#C9482B' }} />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: '#C9482B' }} />
        </section>
    )
}
