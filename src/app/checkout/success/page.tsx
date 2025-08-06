'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  CheckCircle,
  Package,
  Home,
  ShoppingBag,
  Mail,
  Clock
} from 'lucide-react'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState<string>('')

  // Redirect to home if accessed directly without going through checkout
  useEffect(() => {
    const hasCompletedCheckout = sessionStorage.getItem('checkoutCompleted')
    const savedOrderNumber = sessionStorage.getItem('orderNumber')
    
    if (!hasCompletedCheckout) {
      router.push('/')
    } else {
      setOrderNumber(savedOrderNumber || `ORD-${Date.now().toString().slice(-8)}`)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Comanda a fost plasată cu succes!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Mulțumim pentru comandă! Veți primi un email de confirmare în curând.
            </p>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span className="text-lg font-medium text-gray-900">
                    Numărul comenzii: {orderNumber}
                  </span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Email de confirmare trimis</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Livrare în 3-5 zile lucrătoare</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Următorii pași:
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Veți primi un email de confirmare
                    </p>
                    <p className="text-sm text-blue-700">
                      Cu detaliile comenzii și numărul de urmărire
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Comanda va fi procesată
                    </p>
                    <p className="text-sm text-blue-700">
                      Produsele vor fi pregătite pentru livrare
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Veți fi notificat când comanda pleacă
                    </p>
                    <p className="text-sm text-blue-700">
                      Cu link-ul de urmărire a livrării
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                <span>Pagina principală</span>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Continuă cumpărăturile</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 