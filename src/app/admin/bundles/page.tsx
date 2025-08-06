'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { 
  useBundles, 
  useBundleProducts, 
  useBundleSuggestions, 
  useProducts 
} from '@/hooks/useSupabase'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ShoppingCart,
  Tag,
  Users,
  Eye,
  EyeOff,
  Search,
  Filter,
  Grid,
  List,
  Star,
  StarOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Bundle, Product } from '@/types'

export default function BundlesPage() {
  const { bundles, loading, createBundle, updateBundle, deleteBundle } = useBundles()
  const { products } = useProducts()
  const { bundleProducts, addProductToBundle, removeProductFromBundle } = useBundleProducts()
  const { bundleSuggestions, addBundleSuggestion, removeBundleSuggestion } = useBundleSuggestions()

  // State for creating new bundle
  const [isCreatingBundle, setIsCreatingBundle] = useState(false)
  const [newBundle, setNewBundle] = useState({
    name: '',
    description: '',
    discount_percentage: 10,
    is_active: true
  })
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])

  // State for editing existing bundle
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  // Format price function
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'MDL'
    }).format(price).replace(',', '.')
  }

  // Get bundle products and suggestions
  const getBundleProducts = (bundleId: string) => {
    const productIds = bundleProducts
      .filter(bp => bp.bundle_id === bundleId)
      .map(bp => bp.product_id)
    return products.filter(p => productIds.includes(p.id))
  }

  const getBundleSuggestions = (bundleId: string) => {
    const productIds = bundleSuggestions
      .filter(bs => bs.bundle_id === bundleId)
      .map(bs => bs.product_id)
    return products.filter(p => productIds.includes(p.id))
  }

  // Filtered bundles
  const filteredBundles = useMemo(() => {
    return bundles.filter(bundle => {
      const matchesSearch = bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (bundle.description && bundle.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesFilter = filterActive === 'all' || 
                           (filterActive === 'active' && bundle.is_active) ||
                           (filterActive === 'inactive' && !bundle.is_active)
      return matchesSearch && matchesFilter
    })
  }, [bundles, searchTerm, filterActive])

  // Available products for selection (not already in bundle)
  const availableProducts = useMemo(() => {
    return products.filter(product => 
      !selectedProducts.includes(product.id) && 
      !selectedSuggestions.includes(product.id)
    )
  }, [products, selectedProducts, selectedSuggestions])

  // Handle creating bundle with products
  const handleCreateBundle = async () => {
    if (!newBundle.name.trim()) return

    try {
      // Create the bundle first
      const createdBundle = await createBundle(newBundle)
      
      // Add selected products to bundle
      for (const productId of selectedProducts) {
        await addProductToBundle(createdBundle.id, productId)
      }

      // Add selected suggestions
      for (const productId of selectedSuggestions) {
        await addBundleSuggestion(createdBundle.id, productId)
      }

      // Reset form
      setNewBundle({
        name: '',
        description: '',
        discount_percentage: 10,
        is_active: true
      })
      setSelectedProducts([])
      setSelectedSuggestions([])
      setIsCreatingBundle(false)
    } catch (error) {
      console.error('Error creating bundle:', error)
    }
  }

  // Handle updating bundle
  const handleUpdateBundle = async () => {
    if (!editingBundle) return
    try {
      await updateBundle(editingBundle.id, editingBundle)
      setEditingBundle(null)
    } catch (error) {
      console.error('Error updating bundle:', error)
    }
  }

  // Handle deleting bundle
  const handleDeleteBundle = async (id: string) => {
    if (confirm('Sigur doriți să ștergeți acest bundle?')) {
      try {
        await deleteBundle(id)
      } catch (error) {
        console.error('Error deleting bundle:', error)
      }
    }
  }

  // Handle adding/removing products
  const handleAddProductToBundle = async (bundleId: string, productId: string) => {
    try {
      await addProductToBundle(bundleId, productId)
    } catch (error) {
      console.error('Error adding product to bundle:', error)
    }
  }

  const handleRemoveProductFromBundle = async (bundleId: string, productId: string) => {
    try {
      await removeProductFromBundle(bundleId, productId)
    } catch (error) {
      console.error('Error removing product from bundle:', error)
    }
  }

  const handleAddBundleSuggestion = async (bundleId: string, productId: string) => {
    try {
      await addBundleSuggestion(bundleId, productId)
    } catch (error) {
      console.error('Error adding bundle suggestion:', error)
    }
  }

  const handleRemoveBundleSuggestion = async (bundleId: string, productId: string) => {
    try {
      await removeBundleSuggestion(bundleId, productId)
    } catch (error) {
      console.error('Error removing bundle suggestion:', error)
    }
  }

  return (
    <AdminGuard>
      <AdminPanel>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 mr-2" />
              Bundle-uri
            </h1>
              <p className="text-sm text-gray-600 mt-1">
              Gestionați bundle-urile și ofertele speciale
            </p>
            </div>
            <button
              onClick={() => setIsCreatingBundle(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Bundle Nou
            </button>
          </div>

          {/* Create Bundle Modal */}
          <AnimatePresence>
            {isCreatingBundle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Creează Bundle Nou
            </h2>
                      <button
                        onClick={() => setIsCreatingBundle(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Bundle Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titlu Bundle *
                </label>
                <input
                  type="text"
                  value={newBundle.name}
                  onChange={(e) => setNewBundle({ ...newBundle, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Smart Home Starter Pack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descriere
                </label>
                <input
                  type="text"
                  value={newBundle.description}
                  onChange={(e) => setNewBundle({ ...newBundle, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Descriere bundle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newBundle.discount_percentage}
                  onChange={(e) => setNewBundle({ ...newBundle, discount_percentage: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    {/* Product Selection */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Bundle Products */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          Produse în Bundle ({selectedProducts.length})
                        </h3>
                        <div className="space-y-2 mb-4">
                          {selectedProducts.map((productId) => {
                            const product = products.find(p => p.id === productId)
                            return product ? (
                              <div key={productId} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                  {product.image && (
                                    <img
                                      src={product.image}
                                      alt={product.title}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium text-sm">{product.title}</div>
                                    <div className="text-xs text-gray-500">{formatPrice(product.retail_price)}</div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedProducts(prev => prev.filter(id => id !== productId))}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : null
                          })}
                        </div>
                        {selectedProducts.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Nu există produse selectate
                          </p>
                        )}
                      </div>

                      {/* Bundle Suggestions */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Sugestii Bundle ({selectedSuggestions.length})
                        </h3>
                        <div className="space-y-2 mb-4">
                          {selectedSuggestions.map((productId) => {
                            const product = products.find(p => p.id === productId)
                            return product ? (
                              <div key={productId} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                  {product.image && (
                                    <img
                                      src={product.image}
                                      alt={product.title}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium text-sm">{product.title}</div>
                                    <div className="text-xs text-gray-500">{formatPrice(product.retail_price)}</div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedSuggestions(prev => prev.filter(id => id !== productId))}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : null
                          })}
                        </div>
                        {selectedSuggestions.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Nu există sugestii selectate
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Available Products */}
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Produse Disponibile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                        {availableProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded-lg border hover:shadow-sm transition-shadow">
                            <div className="flex items-center space-x-3 flex-1">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{product.title}</div>
                                <div className="text-xs text-gray-500">{formatPrice(product.retail_price)}</div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setSelectedProducts(prev => [...prev, product.id])}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Adaugă în bundle"
                              >
                                <Package className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedSuggestions(prev => [...prev, product.id])}
                                className="p-1 text-purple-600 hover:text-purple-800"
                                title="Adaugă ca sugestie"
                              >
                                <Tag className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setIsCreatingBundle(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Anulează
                      </button>
                      <button
                        onClick={handleCreateBundle}
                        disabled={!newBundle.name.trim()}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Creează Bundle
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Caută bundle-uri..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilterActive('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterActive === 'all' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Toate
                  </button>
                  <button
                    onClick={() => setFilterActive('active')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterActive === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterActive('inactive')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterActive === 'inactive' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bundles List */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Se încarcă bundle-urile...</p>
            </div>
          ) : filteredBundles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterActive !== 'all' ? 'Nu s-au găsit bundle-uri' : 'Nu există bundle-uri'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterActive !== 'all' 
                  ? 'Încearcă să modifici filtrele sau termenul de căutare'
                  : 'Creează primul bundle pentru a începe'
                }
              </p>
              {!searchTerm && filterActive === 'all' && (
                <button
                  onClick={() => setIsCreatingBundle(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Creează Bundle
                </button>
              )}
              </div>
            ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredBundles.map((bundle) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Bundle Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          bundle.is_active 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {bundle.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {editingBundle?.id === bundle.id ? (
                              <input
                                type="text"
                                value={editingBundle.name}
                                onChange={(e) => setEditingBundle({ ...editingBundle, name: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              bundle.name
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {editingBundle?.id === bundle.id ? (
                              <input
                                type="text"
                                value={editingBundle.description || ''}
                                onChange={(e) => setEditingBundle({ ...editingBundle, description: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              bundle.description || 'Fără descriere'
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600">
                            {editingBundle?.id === bundle.id ? (
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={editingBundle.discount_percentage}
                                onChange={(e) => setEditingBundle({ ...editingBundle, discount_percentage: parseInt(e.target.value) })}
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              `${bundle.discount_percentage}%`
                            )}
                          </div>
                          <div className="text-xs text-gray-500">Discount</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {editingBundle?.id === bundle.id ? (
                            <>
                              <button
                                onClick={handleUpdateBundle}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Salvează"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingBundle(null)}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                title="Anulează"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingBundle(bundle)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Editează"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBundle(bundle.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Șterge"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bundle Content */}
                  <div className="p-6">
                    {/* Products Summary */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Produse</span>
                          </div>
                          <span className="text-lg font-bold text-blue-600">
                            {getBundleProducts(bundle.id).length}
                          </span>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">Sugestii</span>
                          </div>
                          <span className="text-lg font-bold text-purple-600">
                            {getBundleSuggestions(bundle.id).length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Products List */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                        Produse în Bundle
                        </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                          {getBundleProducts(bundle.id).map((product) => (
                          <div key={product.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-6 h-6 rounded object-cover"
                                />
                              )}
                              <span className="text-sm font-medium truncate">{product.title}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">{formatPrice(product.retail_price)}</span>
                              <button
                                onClick={() => handleRemoveProductFromBundle(bundle.id, product.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Elimină din bundle"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            </div>
                          ))}
                        {getBundleProducts(bundle.id).length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-2">Nu există produse</p>
                        )}
                      </div>
                      </div>

                    {/* Suggestions List */}
                    <div className="space-y-3 mt-4">
                      <h4 className="font-medium text-gray-900 flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                        Sugestii Bundle
                        </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                          {getBundleSuggestions(bundle.id).map((product) => (
                          <div key={product.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-6 h-6 rounded object-cover"
                                />
                              )}
                              <span className="text-sm font-medium truncate">{product.title}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">{formatPrice(product.retail_price)}</span>
                              <button
                                onClick={() => handleRemoveBundleSuggestion(bundle.id, product.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Elimină sugestia"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            </div>
                          ))}
                        {getBundleSuggestions(bundle.id).length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-2">Nu există sugestii</p>
                        )}
                      </div>
                    </div>

                    {/* Add Products */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-3">Adaugă Produse</h4>
                      <div className="grid grid-cols-1 gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddProductToBundle(bundle.id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          >
                          <option value="">Adaugă în bundle...</option>
                            {products
                              .filter(p => !getBundleProducts(bundle.id).find(bp => bp.id === p.id))
                              .map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.title} - {formatPrice(product.retail_price)}
                                </option>
                              ))}
                          </select>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddBundleSuggestion(bundle.id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          >
                          <option value="">Adaugă ca sugestie...</option>
                            {products
                              .filter(p => !getBundleSuggestions(bundle.id).find(bs => bs.id === p.id))
                              .map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.title} - {formatPrice(product.retail_price)}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 