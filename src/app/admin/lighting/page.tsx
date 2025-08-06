'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useProducts } from '@/hooks/useData'
import { 
  Lightbulb, 
  Plus, 
  Edit, 
  Trash2, 
  Zap,
  Palette,
  Sun,
  Moon
} from 'lucide-react'

export default function LightingPage() {
  const { products } = useProducts()
  
  // Фильтруем продукты для освещения
  const lightingProducts = products.filter(product => 
    product.category === 'lighting' || 
    product.metadata?.['Tip lumină'] ||
    product.title.toLowerCase().includes('bulb') ||
    product.title.toLowerCase().includes('light') ||
    product.title.toLowerCase().includes('lumină') ||
    product.title.toLowerCase().includes('hue')
  )

  const [selectedFilter, setSelectedFilter] = useState('all')

  const filters = [
    { id: 'all', name: 'Toate', count: lightingProducts.length },
    { id: 'rgb', name: 'RGB', count: lightingProducts.filter(p => p.metadata?.['Tip lumină'] === 'RGB').length },
    { id: 'led', name: 'LED', count: lightingProducts.filter(p => p.metadata?.['Tip lumină'] === 'LED').length },
    { id: 'smart', name: 'Smart LED', count: lightingProducts.filter(p => p.metadata?.['Tip lumină'] === 'Smart LED').length },
    { id: 'warm', name: 'Warm White', count: lightingProducts.filter(p => p.metadata?.['Tip lumină'] === 'Warm White').length }
  ]

  const filteredProducts = selectedFilter === 'all' 
    ? lightingProducts 
    : lightingProducts.filter(product => {
        switch (selectedFilter) {
          case 'rgb':
            return product.metadata?.['Tip lumină'] === 'RGB'
          case 'led':
            return product.metadata?.['Tip lumină'] === 'LED'
          case 'smart':
            return product.metadata?.['Tip lumină'] === 'Smart LED'
          case 'warm':
            return product.metadata?.['Tip lumină'] === 'Warm White'
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
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Iluminat Inteligent</h1>
              <p className="text-gray-600">Gestionați sistemele de iluminat smart</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Produse</p>
                  <p className="text-2xl font-bold text-gray-900">{lightingProducts.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">RGB</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lightingProducts.filter(p => p.metadata?.['Tip lumină'] === 'RGB').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">LED</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lightingProducts.filter(p => p.metadata?.['Tip lumină'] === 'LED').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Smart LED</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lightingProducts.filter(p => p.metadata?.['Tip lumină'] === 'Smart LED').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sun className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Power Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuția Puterii</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['5W', '10W', '15W', '20W', '25W', '40W', '60W', '100W'].map((power) => {
                const count = lightingProducts.filter(p => p.metadata?.Putere === power).length
                return (
                  <div key={power} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{power}</div>
                  </div>
                )
              })}
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
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
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
                Produse Iluminat ({filteredProducts.length})
              </h3>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există produse</h3>
                <p className="text-gray-500">Nu s-au găsit produse de iluminat în această categorie.</p>
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
                            {product.metadata?.['Tip lumină'] && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {product.metadata['Tip lumină']}
                              </span>
                            )}
                            {product.metadata?.Putere && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {product.metadata.Putere}
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
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-4">Acțiuni Rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Adaugă Bec</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Palette className="w-5 h-5" />
                <span>Configurare RGB</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Moon className="w-5 h-5" />
                <span>Scenarii Nocturne</span>
              </button>
            </div>
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 