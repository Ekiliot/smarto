'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useProducts, useCategories } from '@/hooks/useSupabase'
import { useCart } from '@/hooks/useCart'
import { useShipping } from '@/hooks/useShipping'
import { useBundleOffers } from '@/hooks/useSupabase'
import BundleOffer from '@/components/BundleOffer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import ProductCard from '@/components/ProductCard'
import {
  Star,
  ShoppingCart,
  Share2,
  Minus,
  Plus,
  CheckCircle,
  Truck,
  Award,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  MessageCircle,
  Zap,
  Smartphone,
  Wifi,
  Package
} from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  
  const { products, loading: productsLoading } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()
  const { addToCart } = useCart()
  const { getCheapestMethod, loading: shippingLoading } = useShipping()
  const { bundleOffers, loading: bundlesLoading, fetchBundleOffers } = useBundleOffers()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Load bundle offers for this product
  useEffect(() => {
    if (productId) {
      fetchBundleOffers(productId)
    }
  }, [productId, fetchBundleOffers])

  const product = products.find(p => p.id === productId)
  const category = product ? categories.find(c => c.id === product.category_id) : null

  // Изображения товара (используем только изображение из БД)
  const productImages = product?.image ? [product.image] : []

  // Helper function for price formatting
  const formatPrice = (price: string | number | null | undefined): string => {
    if (price === null || price === undefined) return '0'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return numPrice.toLocaleString('ro-RO')
  }

  // Calculate shipping info
  const productPrice = product ? (typeof product.retail_price === 'string' ? parseFloat(product.retail_price) : product.retail_price) : 0
  const shippingInfo = getCheapestMethod(productPrice)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
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

  const discount = product.compare_price ? Math.round(((typeof product.compare_price === 'string' ? parseFloat(product.compare_price) : product.compare_price) - (typeof product.retail_price === 'string' ? parseFloat(product.retail_price) : product.retail_price)) / (typeof product.compare_price === 'string' ? parseFloat(product.compare_price) : product.compare_price) * 100) : 0

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return
    
    setIsAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleShare = async () => {
    const currentUrl = window.location.href
    
    setIsSharing(true)
    try {
      if (navigator.share) {
        // Используем Web Share API если доступен
        await navigator.share({
          title: product.title,
          text: `Vezi acest produs: ${product.title}`,
          url: currentUrl
        })
      } else {
        // Fallback - копируем в буфер обмена
        await navigator.clipboard.writeText(currentUrl)
        // Можно добавить уведомление об успешном копировании
        alert('Link-ul a fost copiat în clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback для старых браузеров
      try {
        const textArea = document.createElement('textarea')
        textArea.value = currentUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Link-ul a fost copiat în clipboard!')
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
        alert('Nu s-a putut copia link-ul. Încercați să copiați manual: ' + currentUrl)
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-orange-600">Acasă</a>
            <span>/</span>
            <a href="/products" className="hover:text-orange-600">Produse</a>
            {category && (
              <>
                <span>/</span>
                <span className="text-gray-900">{category.name}</span>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Левая сторона - Галерея изображений */}
          <div className="space-y-4">
            {/* Главное изображение */}
            <div className="relative aspect-square bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group">
              <Image
                src={productImages[selectedImage]}
                alt={product.title}
                fill
                className="object-cover cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={selectedImage === 0}
                quality={85}
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}%
                </div>
              )}
              
              {/* Навигационные кнопки */}
              <button 
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                disabled={selectedImage === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setSelectedImage(Math.min(productImages.length - 1, selectedImage + 1))}
                disabled={selectedImage === productImages.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Миниатюры */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-orange-600 ring-2 ring-orange-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 10vw"
                      quality={75}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Правая сторона - Информация о товаре */}
          <div className="space-y-6">
            {/* Заголовок */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Цена */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.retail_price)} MDL
                </span>
                {product.compare_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.compare_price)} MDL
                  </span>
                )}
              </div>
              {discount > 0 && (
                <div className="text-green-600 font-semibold">
                  Economisești {formatPrice((typeof product.compare_price === 'string' ? parseFloat(product.compare_price) : product.compare_price!) - (typeof product.retail_price === 'string' ? parseFloat(product.retail_price) : product.retail_price))} MDL
                </div>
              )}
            </div>

            {/* Метаданные */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Caracteristici</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-gray-600">{key}: {value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Количество и кнопки */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Cantitate:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} în stoc
                </span>
              </div>

              <div className="space-y-4">
                {/* Кнопки действий */}
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingToCart}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isAddingToCart ? 'Se adaugă...' : 'Adaugă în coș'}</span>
                </button>
                <button 
                  onClick={handleShare}
                  disabled={isSharing}
                  className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSharing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </button>
                </div>

                {/* Bundle Offers - под кнопкой добавить в корзину */}
                {bundleOffers.length > 0 && (
                  <div className="space-y-3">
                    {bundleOffers.map((bundleOffer) => (
                      <BundleOffer
                        key={bundleOffer.bundle.id}
                        bundleOffer={bundleOffer}
                        currentProductId={productId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Информация о доставке */}
            {!shippingLoading && shippingInfo && (
              <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {shippingInfo.isFree ? 'Livrare gratuită' : `Livrare ${formatPrice(shippingInfo.cost)} MDL`}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {shippingInfo.method.name} • {shippingInfo.estimatedDays} zile lucrătoare
                    </p>
                    {shippingInfo.method.free_shipping_threshold && !shippingInfo.isFree && (
                      <p className="text-xs text-blue-600 mt-1">
                        Livrare gratuită pentru comenzi peste {formatPrice(shippingInfo.method.free_shipping_threshold)} MDL
                      </p>
                    )}
                  </div>
                </div>
                {shippingInfo.method.description && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">Garanție 2 ani</h4>
                      <p className="text-sm text-blue-700">Retur gratuit în 14 zile</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Информация о продавце */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Smarto Store</h4>
                  <p className="text-sm text-gray-600">Magazin oficial de tehnologie smart home</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Описание товара */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Descriere produs</h2>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-orange-600 hover:text-orange-700 flex items-center space-x-1"
            >
              {showFullDescription ? (
                <>
                  <span>Arată mai puțin</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Arată mai mult</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          
          <div className={`${!showFullDescription && 'max-h-32 overflow-hidden'}`}>
            {product.description ? (
              <div 
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                Descrierea produsului nu este disponibilă momentan.
              </p>
            )}
          </div>
        </div>


      </div>

      {/* Модальное окно для изображения */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative aspect-square max-h-[80vh] max-w-full">
              <Image
                src={productImages[selectedImage]}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                quality={90}
              />
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  )
} 