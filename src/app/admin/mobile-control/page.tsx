'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useProducts } from '@/hooks/useData'
import { 
  Smartphone, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Globe,
  Zap,
  Users
} from 'lucide-react'

export default function MobileControlPage() {
  const { products } = useProducts()
  
  // Фильтруем продукты для мобильного контроля
  const mobileProducts = products.filter(product => 
    product.category === 'mobile' || 
    product.metadata?.Conector === 'Bluetooth' ||
    product.metadata?.Conector === 'WiFi' ||
    product.title.toLowerCase().includes('app') ||
    product.title.toLowerCase().includes('control')
  )

  const [selectedFilter, setSelectedFilter] = useState('all')

  const filters = [
    { id: 'all', name: 'Toate', count: mobileProducts.length },
    { id: 'apps', name: 'Aplicații', count: mobileProducts.filter(p => p.title.toLowerCase().includes('app')).length },
    { id: 'bluetooth', name: 'Bluetooth', count: mobileProducts.filter(p => p.metadata?.Conector === 'Bluetooth').length },
    { id: 'wifi', name: 'WiFi', count: mobileProducts.filter(p => p.metadata?.Conector === 'WiFi').length },
    { id: 'remote', name: 'Control remote', count: mobileProducts.filter(p => p.title.toLowerCase().includes('remote')).length }
  ]

  const filteredProducts = selectedFilter === 'all' 
    ? mobileProducts 
    : mobileProducts.filter(product => {
        switch (selectedFilter) {
          case 'apps':
            return product.title.toLowerCase().includes('app')
          case 'bluetooth':
            return product.metadata?.Conector === 'Bluetooth'
          case 'wifi':
            return product.metadata?.Conector === 'WiFi'
          case 'remote':
            return product.title.toLowerCase().includes('remote')
          default:
            return true
        }
      })

  return (
    <AdminGuard>
      <AdminPanel>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Control Mobil</h1>
              <p className="text-gray-600">Gestionați aplicațiile și controlul mobil</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Produse</p>
                  <p className="text-2xl font-bold text-gray-900">{mobileProducts.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aplicații</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mobileProducts.filter(p => p.title.toLowerCase().includes('app')).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">WiFi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mobileProducts.filter(p => p.metadata?.Conector === 'WiFi').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bluetooth</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mobileProducts.filter(p => p.metadata?.Conector === 'Bluetooth').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtre</h3>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter.id
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.name} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Produse Control Mobil ({filteredProducts.length})
              </h3>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există produse</h3>
                <p className="text-gray-500">Nu s-au găsit produse pentru control mobil în această categorie.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {product.retailPrice} MDL
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.status === 'published' ? 'Publicat' : 'Ciornă'}
                            </span>
                            {product.metadata?.Conector && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {product.metadata.Conector}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-4">Acțiuni Rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Adaugă Aplicație</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Download className="w-5 h-5" />
                <span>Descarcă Raport</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Users className="w-5 h-5" />
                <span>Utilizatori Activi</span>
              </button>
            </div>
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 