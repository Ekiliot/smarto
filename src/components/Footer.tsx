'use client'

import Link from 'next/link'
import { Zap, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { useCategories } from '@/hooks/useSupabase'

export default function Footer() {
  const { categories, loading: categoriesLoading } = useCategories()

  // Получаем первые 3 активные категории
  const activeCategories = categories.filter(cat => cat.is_active).slice(0, 3)

  return (
    <footer className="bg-gray-900 text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-smarto-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Smarto</span>
            </div>
            <p className="text-gray-300 text-sm">
              Liderul în tehnologia casă inteligentă din Moldova. 
              Facem viața mai ușoară cu dispozitive inteligente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Link-uri rapide</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Produse
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Categorii
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Despre noi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                  Suport tehnic
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorii</h3>
            <ul className="space-y-2 text-sm">
              {categoriesLoading ? (
                // Показываем скелетон во время загрузки
                <>
                  <li className="h-4 bg-gray-700 rounded animate-pulse"></li>
                  <li className="h-4 bg-gray-700 rounded animate-pulse"></li>
                  <li className="h-4 bg-gray-700 rounded animate-pulse"></li>
                  <li className="h-4 bg-gray-700 rounded animate-pulse"></li>
                </>
              ) : (
                <>
                  {/* Реальные категории */}
                  {activeCategories.map((category) => (
                    <li key={category.id}>
                      <Link 
                        href={`/products?category=${category.slug}`} 
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {category.name}
                </Link>
              </li>
                  ))}
                  {/* Ссылка на все товары */}
              <li>
                    <Link 
                      href="/products" 
                      className="text-gray-300 hover:text-white transition-colors font-medium"
                    >
                      Toate produsele
                </Link>
              </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Chișinău, Moldova</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">+373 22 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">info@smarto.md</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Smarto. Toate drepturile rezervate.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Politica de confidențialitate
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termeni și condiții
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 