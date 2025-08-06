'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useProducts, useCategories, useMetadata, useUsers, useShippingMethods, usePaymentMethods } from '@/hooks/useData'
import { 
  Package, 
  Tag, 
  Database, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { products } = useProducts()
  const { categories } = useCategories()
  const { metadata } = useMetadata()
  const { users } = useUsers()
  const { shippingMethods } = useShippingMethods()
  const { paymentMethods } = usePaymentMethods()

  const stats = {
    products: products.length,
    categories: categories.length,
    metadata: metadata.length,
    users: users.length,
    shippingMethods: shippingMethods.length,
    paymentMethods: paymentMethods.length,
    revenue: 0, // Will be calculated from orders
    views: 0 // Will be tracked separately
  }

  const recentActivities = [
    {
      id: 1,
      type: 'product',
      action: 'Produse disponibile',
      item: `${products.length} produse`,
      time: 'Actualizat acum'
    },
    {
      id: 2,
      type: 'category',
      action: 'Categorii active',
      item: `${categories.length} categorii`,
      time: 'Actualizat acum'
    },
    {
      id: 3,
      type: 'user',
      action: 'Utilizatori înregistrați',
      item: `${users.length} utilizatori`,
      time: 'Actualizat acum'
    },
    {
      id: 4,
      type: 'shipping',
      action: 'Metode de livrare',
      item: `${shippingMethods.length} metode`,
      time: 'Actualizat acum'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4 text-smarto-600" />
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-green-600" />
      case 'customer':
        return <Users className="w-4 h-4 text-blue-600" />
      case 'category':
        return <Tag className="w-4 h-4 text-purple-600" />
      default:
        return <Database className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <AdminGuard>
      <AdminPanel>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-smarto-600 to-smarto-700 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Bun venit în Smarto Admin!</h1>
            <p className="text-smarto-100">
              Administrează-ți magazinul de tehnologie smart home din Moldova
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produse</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
                </div>
                <div className="w-12 h-12 bg-smarto-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-smarto-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorii</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilizatori</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Venituri</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.revenue} MDL</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Activități recente</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.item}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Acțiuni rapide</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="/admin/products"
                    className="flex items-center p-4 bg-smarto-50 rounded-lg hover:bg-smarto-100 transition-colors"
                  >
                    <Package className="w-5 h-5 text-smarto-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Adaugă produs</p>
                      <p className="text-xs text-gray-500">Produs nou</p>
                    </div>
                  </a>

                  <a
                    href="/admin/categories"
                    className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Tag className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Categorii</p>
                      <p className="text-xs text-gray-500">Administrare</p>
                    </div>
                  </a>

                  <a
                    href="/admin/metadata"
                    className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Database className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Metadate</p>
                      <p className="text-xs text-gray-500">Configurare</p>
                    </div>
                  </a>

                  <a
                    href="/admin/reports"
                    className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Rapoarte</p>
                      <p className="text-xs text-gray-500">Statistici</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 