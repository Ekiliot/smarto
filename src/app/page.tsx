'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import Hero from '@/components/Hero'
import MobileBenefitsCarousel from '@/components/MobileBenefitsCarousel'
import ProductCard from '@/components/ProductCard'
import { useProducts, useCategories } from '@/hooks/useSupabase'
import { useCart } from '@/hooks/useCart'
import { useShipping } from '@/hooks/useShipping'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { 
  Zap, 
  Shield, 
  Wifi, 
  Smartphone, 
  Lightbulb, 
  Camera, 
  Thermometer, 
  Speaker, 
  Package, 
  ShoppingCart, 
  CreditCard,
  Search,
  ChevronRight,
  Star,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const { supabaseUser } = useSupabaseAuth()
  const { products, loading: productsLoading } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()
  const { getCartCount } = useCart()
  
  // Filter only published products
  const featuredProducts = products.filter(product => product.status === 'published')
  
  // Получаем количество товаров в корзине
  const cartCount = getCartCount()
  
  // Mobile search state
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mobile checkout panel visibility state
  const [showCheckoutPanel, setShowCheckoutPanel] = useState(true)
  
  // Handle scroll to hide/show checkout panel
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateCheckoutPanel = () => {
      const currentScrollY = window.scrollY
      
      // Hide panel when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowCheckoutPanel(false)
      } else if (currentScrollY < lastScrollY) {
        setShowCheckoutPanel(true)
      }
      
      lastScrollY = currentScrollY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateCheckoutPanel)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      'Iluminat': Lightbulb,
      'Securitate': Camera,
      'Climatizare': Thermometer,
      'Audio': Speaker,
      'General': Package
    }
    return iconMap[categoryName] || Package
  }

  const getProductCount = (categoryId: string) => {
    return products.filter(product => product.category_id === categoryId).length
  }

  // Show loading state only if both products and categories are loading
  const isLoading = productsLoading || categoriesLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Header />
        </div>
        <main className="py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-500 rounded animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Se încarcă...</p>
            </div>
          </div>
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Header />
      </div>
      
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Mobile Benefits Carousel */}
        <div className="md:hidden">
          <MobileBenefitsCarousel />
        </div>

        {/* Categories Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Categorii
              </h2>
              <p className="text-gray-600">
                Explorați produsele noastre organizate pe categorii
              </p>
            </div>

            {/* Desktop Categories Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.name)
                const productCount = getProductCount(category.id)
                
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-orange-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                        <IconComponent className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {productCount} produs{productCount !== 1 ? 'e' : ''}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Categories Scroll */}
            <div className="md:hidden">
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name)
                  const productCount = getProductCount(category.id)
                  
                  return (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-32 hover:shadow-md transition-all duration-200 hover:border-orange-200"
                    >
                      <div className="text-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                          <IconComponent className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {productCount} produs{productCount !== 1 ? 'e' : ''}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Produse recomandate
                </h2>
                <p className="text-gray-600">
                  Cele mai populare produse din colecția noastră
                </p>
              </div>
              
              <Link
                href="/products"
                className="hidden md:inline-flex items-center space-x-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <span>Vezi toate</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Desktop Products Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  title={product.title}
                  price={product.retail_price}
                  originalPrice={product.compare_price}
                  image={product.image || ''}
                  inStock={product.stock > 0}
                />
              ))}
            </div>

            {/* Mobile Products Scroll */}
            <div className="md:hidden">
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                {featuredProducts.slice(0, 6).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-64">
                    <ProductCard 
                      id={product.id}
                      title={product.title}
                      price={product.retail_price}
                      originalPrice={product.compare_price}
                      image={product.image || ''}
                      inStock={product.stock > 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View All Button */}
            <div className="md:hidden text-center mt-6">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <span>Vezi toate produsele</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section - Hidden on mobile */}
        <section className="py-16 bg-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                De ce să alegi Smarto?
              </h2>
              <p className="text-lg text-gray-600">
                Avantajele noastre pentru casa ta inteligentă
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Livrare rapidă
                </h3>
                <p className="text-gray-600">
                  Livrare în toată Moldova în 24-48 ore
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Garanție extinsă
                </h3>
                <p className="text-gray-600">
                  Garanție de 2 ani pentru toate produsele
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Suport tehnic
                </h3>
                <p className="text-gray-600">
                  Asistență tehnică gratuită 24/7
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aplicație mobilă
                </h3>
                <p className="text-gray-600">
                  Control total din aplicația noastră
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Fixed Checkout Button */}
      {cartCount > 0 && (
        <div className={`md:hidden fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ${
          showCheckoutPanel ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{cartCount}</span> produse în coș
                </div>
              </div>
              <button
                onClick={() => router.push('/cart')}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Finalizează comanda</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
} 