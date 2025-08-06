'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Truck, 
  Percent, 
  Zap, 
  Shield, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const benefits = [
  {
    id: 1,
    icon: Truck,
    title: 'Livrare gratuită',
    description: 'Pentru comenzi peste 220 MDL',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    id: 2,
    icon: Clock,
    title: 'Livrare rapidă',
    description: '1-5 zile lucrătoare',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    icon: Percent,
    title: 'Reduceri până la 30%',
    description: 'Pe o gamă largă de produse',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600'
  },
  {
    id: 4,
    icon: Shield,
    title: 'Garanție 2 ani',
    description: 'Retur gratuit în 14 zile',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    id: 5,
    icon: Zap,
    title: 'Suport tehnic',
    description: 'Asistență 24/7',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  {
    id: 6,
    icon: Star,
    title: 'Calitate garantată',
    description: 'Produse originale',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600'
  }
]

export default function MobileBenefitsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % benefits.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => (prev + newDirection + benefits.length) % benefits.length)
  }

  return (
    <div className="md:hidden bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 px-4">
      <div className="max-w-sm mx-auto">
        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              className="absolute w-full h-full"
            >
              <div className={`w-full h-48 ${benefits[currentIndex].bgColor} flex items-center justify-center`}>
                <div className="text-center px-6">
                                     <div className={`w-16 h-16 bg-gradient-to-br ${benefits[currentIndex].color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                     {React.createElement(benefits[currentIndex].icon, { className: 'w-8 h-8 text-white' })}
                   </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefits[currentIndex].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefits[currentIndex].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Livrare gratuită</p>
                <p className="text-xs text-gray-500">Peste 220 MDL</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">1-5 zile</p>
                <p className="text-xs text-gray-500">Livrare rapidă</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 