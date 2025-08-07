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

export default function Home() {
  const router = useRouter()
  const { supabaseUser } = useSupabaseAuth()
  const { products, loading: productsLoading, refresh: refreshProducts } = useProducts()
  const { categories, loading: categoriesLoading, refresh: refreshCategories } = useCategories()
  const { getCartCount, refresh: refreshCart } = useCart()
  
  // Filter only published products
  const featuredProducts = products.filter(product => product.status === 'published')
  
  // Получаем количество товаров в корзине
  const cartCount = getCartCount()
  
  // Mobile search state
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mobile checkout panel visibility state
  const [showCheckoutPanel, setShowCheckoutPanel] = useState(true)
  
  // Принудительная перезагрузка данных при изменении пользователя
  useEffect(() => {
    if (supabaseUser) {
      console.log('User authenticated, refreshing data...')
      refreshProducts()
      refreshCategories()
      refreshCart()
    }
  }, [supabaseUser, refreshProducts, refreshCategories, refreshCart])
  
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

  // Map category icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('iluminat') || name.includes('light')) return Lightbulb
    if (name.includes('securitate') || name.includes('security')) return Camera
    if (name.includes('climatic') || name.includes('climate')) return Thermometer
    if (name.includes('divertisment') || name.includes('entertainment')) return Speaker
    return Package
  }

  // Get product count for each category
  const getProductCount = (categoryId: string) => {
    return products.filter(product => product.category_id === categoryId && product.status === 'published').length
  }

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă...</p>
          </div>
        </div>
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
        {/* Mobile Marketplace Header */}
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Căutați produse pentru casa inteligentă..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Star className="w-4 h-4" />
                  <span>Top</span>
                </div>
              </div>
              
              {/* Cart Button with Badge */}
              {cartCount > 0 && (
                <button
                  onClick={() => router.push('/cart')}
                  className="relative flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">Finalizează ({cartCount})</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Categories Section */}
        {categories.length > 0 && (
          <section className="md:hidden bg-white py-4">
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Categorii</h2>
                <button
                  onClick={() => router.push('/products')}
                  className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  <span>Vezi toate</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name)
                  const productCount = getProductCount(category.id)
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => router.push(`/products?category=${category.id}`)}
                      className="flex-shrink-0 w-24 text-center cursor-pointer group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:from-orange-200 group-hover:to-red-200 transition-colors">
                        <IconComponent className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="text-xs font-medium text-gray-900 mb-1 truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {productCount} produse
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <Hero cartCount={cartCount} />
        <MobileBenefitsCarousel />

        {/* Desktop Categories Section */}
        {categories.length > 0 && (
          <section className="py-16 bg-white hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Explorează categorii
                </h2>
                <p className="text-lg text-gray-600">
                  Găsește dispozitivele perfecte pentru casa ta inteligentă
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name)
                  const productCount = getProductCount(category.id)
                  
                  return (
                    <div
                      key={category.id}
                      className="group bg-gray-50 rounded-xl p-6 hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                        <IconComponent className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {category.description || 'Descrierea categoriei'}
                      </p>
                      <p className="text-sm text-orange-600 font-medium">
                        {productCount} produse
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Mobile Products Section */}
        <section className="md:hidden bg-gray-50 py-4">
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Produse populare</h2>
              <button
                onClick={() => router.push('/products')}
                className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700"
              >
                <span>Vezi toate</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Nu există produse</h3>
                <p className="text-sm text-gray-500">Produsele vor apărea aici după ce vor fi adăugate.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.slice(0, 6).map((product) => (
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
            )}
          </div>
        </section>

        {/* Desktop Featured Products Section */}
        <section className="py-8 md:py-16 bg-gray-50 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
                Produse populare
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Cele mai vândute dispozitive inteligente
              </p>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există produse</h3>
                <p className="text-gray-500">Produsele vor apărea aici după ce vor fi adăugate în admin panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {featuredProducts.map((product) => (
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
            )}

            <div className="text-center mt-12">
              <button 
                onClick={() => router.push('/products')}
                className="btn-primary"
              >
                Vezi toate produsele
              </button>
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

      <Footer />
      
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
                  className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
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