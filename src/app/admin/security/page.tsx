'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useProducts } from '@/hooks/useData'
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Camera,
  Bell,
  Lock,
  Eye
} from 'lucide-react'

export default function SecurityPage() {
  const { products } = useProducts()
  
  // Фильтруем продукты для безопасности
  const securityProducts = products.filter(product => 
    product.category === 'security' || 
    product.title.toLowerCase().includes('camera') ||
    product.title.toLowerCase().includes('doorbell') ||
    product.title.toLowerCase().includes('alarm') ||
    product.title.toLowerCase().includes('lock') ||
    product.title.toLowerCase().includes('sensor')
  )

  const [selectedFilter, setSelectedFilter] = useState('all')

  const filters = [
    { id: 'all', name: 'Toate', count: securityProducts.length },
    { id: 'cameras', name: 'Camere', count: securityProducts.filter(p => p.title.toLowerCase().includes('camera')).length },
    { id: 'doorbells', name: 'Sonerii', count: securityProducts.filter(p => p.title.toLowerCase().includes('doorbell')).length },
    { id: 'locks', name: 'Uși', count: securityProducts.filter(p => p.title.toLowerCase().includes('lock')).length },
    { id: 'sensors', name: 'Senzori', count: securityProducts.filter(p => p.title.toLowerCase().includes('sensor')).length }
  ]

  const filteredProducts = selectedFilter === 'all' 
    ? securityProducts 
    : securityProducts.filter(product => {
        switch (selectedFilter) {
          case 'cameras':
            return product.title.toLowerCase().includes('camera')
          case 'doorbells':
            return product.title.toLowerCase().includes('doorbell')
          case 'locks':
            return product.title.toLowerCase().includes('lock')
          case 'sensors':
            return product.title.toLowerCase().includes('sensor')
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
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Securitate</h1>
              <p className="text-gray-600">Gestionați sistemele de securitate</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Produse</p>
                  <p className="text-2xl font-bold text-gray-900">{securityProducts.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Camere</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {securityProducts.filter(p => p.title.toLowerCase().includes('camera')).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sonerii</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {securityProducts.filter(p => p.title.toLowerCase().includes('doorbell')).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uși</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {securityProducts.filter(p => p.title.toLowerCase().includes('lock')).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Prezentare Securitate</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <Eye className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-red-900">Monitorizare</div>
                <div className="text-sm text-red-600">Camere și senzori</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-900">Alertare</div>
                <div className="text-sm text-blue-600">Sisteme de alarmă</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-900">Control Acces</div>
                <div className="text-sm text-green-600">Uși și chei</div>
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
                      ? 'bg-red-100 text-red-700 border border-red-200'
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
                Produse Securitate ({filteredProducts.length})
              </h3>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există produse</h3>
                <p className="text-gray-500">Nu s-au găsit produse de securitate în această categorie.</p>
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
                            {product.metadata?.Brand && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                {product.metadata.Brand}
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
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-4">Acțiuni Rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Adaugă Cameră</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Bell className="w-5 h-5" />
                <span>Configurare Alarmă</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Lock className="w-5 h-5" />
                <span>Control Acces</span>
              </button>
            </div>
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 