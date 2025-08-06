'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Wifi, Smartphone, ShoppingCart, CreditCard } from 'lucide-react'

interface HeroProps {
  cartCount?: number
}

export default function Hero({ cartCount = 0 }: HeroProps) {
  return (
    <section className="hidden md:block relative bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4 hidden md:block">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Casa ta{' '}
                <span className="text-gradient">inteligentă</span>
                <br />
                începe aici
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Descoperă cea mai mare selecție de dispozitive inteligente pentru casa ta. 
                Controlul total în palma mâinii tale.
              </motion.p>
            </div>

            <motion.div 
              className="hidden md:flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/products" className="btn-primary inline-flex items-center justify-center group">
                Explorează produsele
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/categories" className="btn-secondary inline-flex items-center justify-center">
                Vezi categorii
              </Link>
              {cartCount > 0 && (
                <Link href="/checkout" className="btn-primary inline-flex items-center justify-center bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  Finalizează comanda ({cartCount})
                  <CreditCard className="ml-2 w-4 h-4" />
                </Link>
              )}
            </motion.div>

            {/* Features - Hidden on mobile */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8 hidden md:grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Rapid</h3>
                <p className="text-sm text-gray-600">Instalare ușoară</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Sigur</h3>
                <p className="text-sm text-gray-600">Protecție avansată</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Wifi className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Conectat</h3>
                <p className="text-sm text-gray-600">Control remot</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Visual - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-orange-100 rounded-xl p-4">
                      <Smartphone className="w-8 h-8 text-orange-600" />
                      <p className="text-sm font-medium text-gray-900 mt-2">Control mobil</p>
                    </div>
                    <div className="bg-blue-100 rounded-xl p-4">
                      <Zap className="w-8 h-8 text-blue-600" />
                      <p className="text-sm font-medium text-gray-900 mt-2">Iluminat inteligent</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-green-100 rounded-xl p-4">
                      <Shield className="w-8 h-8 text-green-600" />
                      <p className="text-sm font-medium text-gray-900 mt-2">Securitate</p>
                    </div>
                    <div className="bg-purple-100 rounded-xl p-4">
                      <Wifi className="w-8 h-8 text-purple-600" />
                      <p className="text-sm font-medium text-gray-900 mt-2">Conectivitate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
    </section>
  )
} 