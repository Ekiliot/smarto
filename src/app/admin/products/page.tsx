'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useProducts, useCategories, useMetadataTypes } from '@/hooks/useSupabase'
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react'

export default function AdminProductsPage() {
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()
  const { metadataTypes: availableMetadata, loading: metadataLoading } = useMetadataTypes()
  
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    costPrice: '',
    retailPrice: '',
    comparePrice: '',
    image: '',
    category: 'lighting',
    stock: '',
    metadata: {} as Record<string, string>
  })

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ro-RO')
  }

  const handleAddProduct = async () => {
    if (newProduct.title && newProduct.retailPrice) {
      try {
        await addProduct({
          title: newProduct.title,
          description: newProduct.description,
          cost_price: newProduct.costPrice ? parseInt(newProduct.costPrice) : 0,
          retail_price: parseInt(newProduct.retailPrice),
          compare_price: newProduct.comparePrice ? parseInt(newProduct.comparePrice) : undefined,
          image: newProduct.image || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
          category_id: newProduct.category,
          status: 'draft',
          stock: parseInt(newProduct.stock) || 0,
          metadata: newProduct.metadata
        })
        
        setNewProduct({
          title: '',
          description: '',
          costPrice: '',
          retailPrice: '',
          comparePrice: '',
          image: '',
          category: 'lighting',
          stock: '',
          metadata: {}
        })
        setIsAddingProduct(false)
      } catch (error) {
        console.error('Error adding product:', error)
      }
    }
  }

  const handleEditProduct = (id: string) => {
    const product = products.find(p => p.id === id)
    if (product) {
      setNewProduct({
        title: product.title,
        description: product.description || '',
        costPrice: product.cost_price.toString(),
        retailPrice: product.retail_price.toString(),
        comparePrice: product.compare_price?.toString() || '',
        image: product.image || '',
        category: product.category_id || 'lighting',
        stock: product.stock.toString(),
        metadata: product.metadata
      })
      setEditingProduct(id)
    }
  }

  const handleSaveEdit = async () => {
    if (editingProduct && newProduct.title && newProduct.retailPrice) {
      try {
        await updateProduct(editingProduct, {
          title: newProduct.title,
          description: newProduct.description,
          cost_price: newProduct.costPrice ? parseInt(newProduct.costPrice) : 0,
          retail_price: parseInt(newProduct.retailPrice),
          compare_price: newProduct.comparePrice ? parseInt(newProduct.comparePrice) : undefined,
          image: newProduct.image,
          category_id: newProduct.category,
          stock: parseInt(newProduct.stock) || 0,
          metadata: newProduct.metadata
        })
        
        setNewProduct({
          title: '',
          description: '',
          costPrice: '',
          retailPrice: '',
          comparePrice: '',
          image: '',
          category: 'lighting',
          stock: '',
          metadata: {}
        })
        setEditingProduct(null)
      } catch (error) {
        console.error('Error updating product:', error)
      }
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Sigur doriți să ștergeți acest produs?')) {
      try {
        await deleteProduct(id)
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const toggleProductStatus = async (id: string) => {
    const product = products.find(p => p.id === id)
    if (product) {
      try {
        await updateProduct(id, {
          status: product.status === 'published' ? 'draft' : 'published'
        })
      } catch (error) {
        console.error('Error toggling product status:', error)
      }
    }
  }

  if (productsLoading || categoriesLoading || metadataLoading) {
    return (
      <AdminGuard>
        <AdminPanel>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smarto-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Se încarcă...</p>
            </div>
          </div>
        </AdminPanel>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <AdminPanel>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administrare Produse</h1>
              <p className="text-gray-600">Gestionează produsele din magazin</p>
            </div>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă Produs</span>
            </button>
          </div>

          {/* Add/Edit Product Form */}
          {(isAddingProduct || editingProduct) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Editează Produs' : 'Adaugă Produs Nou'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddingProduct(false)
                    setEditingProduct(null)
                    setNewProduct({
                      title: '',
                      description: '',
                      costPrice: '',
                      retailPrice: '',
                      comparePrice: '',
                      image: '',
                      category: 'lighting',
                      stock: '',
                      metadata: {}
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titlu produs *
                    </label>
                    <input
                      type="text"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                      className="input-field"
                      placeholder="Introduceți titlul produsului"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descriere
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Descrierea produsului"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagine URL
                    </label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categorie
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="input-field"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preț de cost (MDL)
                    </label>
                    <input
                      type="number"
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preț de vânzare (MDL) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.retailPrice}
                      onChange={(e) => setNewProduct({...newProduct, retailPrice: e.target.value})}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preț de comparație (MDL)
                    </label>
                    <input
                      type="number"
                      value={newProduct.comparePrice}
                      onChange={(e) => setNewProduct({...newProduct, comparePrice: e.target.value})}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stoc
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Metadate produs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableMetadata.filter(meta => meta.is_custom).map((meta) => (
                    <div key={meta.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {meta.name}
                      </label>
                      <select
                        value={newProduct.metadata[meta.name] || ''}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          metadata: {
                            ...newProduct.metadata,
                            [meta.name]: e.target.value
                          }
                        })}
                        className="input-field"
                      >
                        <option value="">Selectează {meta.name.toLowerCase()}</option>
                        {meta.options.map((value: string) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={editingProduct ? handleSaveEdit : handleAddProduct}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Salvează Modificările' : 'Adaugă Produs'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Produse ({products.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categorie & Metadate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preț
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stoc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.image}
                              alt={product.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id}
                            </div>
                            {product.description && (
                              <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category_id || 'Necategorizat'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(product.retail_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.compare_price ? formatPrice(product.compare_price) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.compare_price ? `${Math.round(((product.retail_price - product.compare_price) / product.compare_price) * 100)}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(product.cost_price)}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleProductStatus(product.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            product.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status === 'published' ? 'Publicat' : 'Ciornă'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="text-smarto-600 hover:text-smarto-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 