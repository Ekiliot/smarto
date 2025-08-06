'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useProducts, useCategories, useMetadataTypes } from '@/hooks/useSupabase'
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react'
import HtmlEditor from '@/components/HtmlEditor'

export default function AdminProductsSupabasePage() {
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()
  const { metadataTypes: availableMetadata, loading: metadataLoading } = useMetadataTypes()
  
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [isConvertingUrl, setIsConvertingUrl] = useState(false)
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    costPrice: '',
    retailPrice: '',
    comparePrice: '',
    image: '',
    category: '',
    stock: '',
    metadata: {} as Record<string, string>
  })

  // Функция для конвертирования ссылок Google Drive
  const convertGoogleDriveUrl = (url: string): string => {
    // Различные форматы ссылок Google Drive
    const drivePatterns = [
      // Стандартный формат
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/,
      // С дополнительными параметрами
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?[^/]*/,
      // Формат с usp=sharing
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=sharing/,
      // Формат с usp=drive_link
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=drive_link/
    ]
    
    for (const pattern of drivePatterns) {
      const match = url.match(pattern)
      if (match) {
        const fileId = match[1]
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    
    return url
  }

  // Функция для обработки изменения URL изображения с автоматической конвертацией
  const handleImageUrlChange = (url: string) => {
    setNewProduct(prev => ({ ...prev, image: url }))
    
    // Проверяем, является ли это ссылкой Google Drive
    const isGoogleDriveUrl = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/.test(url)
    
    if (isGoogleDriveUrl) {
      setIsConvertingUrl(true)
      
      // Автоматически конвертируем через 2 секунды
      setTimeout(() => {
        const convertedUrl = convertGoogleDriveUrl(url)
        if (convertedUrl !== url) {
          setNewProduct(prev => ({ ...prev, image: convertedUrl }))
        }
        setIsConvertingUrl(false)
      }, 2000)
    } else {
      setIsConvertingUrl(false)
    }
  }

  // Функция для обработки ввода цены
  const handlePriceInput = (value: string, field: 'costPrice' | 'retailPrice' | 'comparePrice') => {
    // Разрешаем только цифры, точку и запятую
    const cleaned = value.replace(/[^\d.,]/g, '')
    
    // Заменяем запятую на точку для правильного парсинга
    const normalized = cleaned.replace(',', '.')
    
    // Проверяем, что после точки не больше 2 цифр
    const parts = normalized.split('.')
    if (parts.length > 2) return // Больше одной точки
    
    if (parts[1] && parts[1].length > 2) return // Больше 2 цифр после точки
    
    setNewProduct(prev => ({
      ...prev,
      [field]: cleaned
    }))
  }

  const handleAddProduct = async () => {
    if (newProduct.title && newProduct.retailPrice) {
      try {
        await addProduct({
          title: newProduct.title,
          description: newProduct.description,
          cost_price: newProduct.costPrice ? parseFloat(newProduct.costPrice.replace(',', '.')) : 0,
          retail_price: parseFloat(newProduct.retailPrice.replace(',', '.')),
          compare_price: newProduct.comparePrice ? parseFloat(newProduct.comparePrice.replace(',', '.')) : undefined,
          image: newProduct.image || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
          category_id: newProduct.category || undefined,
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
          category: '',
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
        category: product.category_id || '',
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
          cost_price: newProduct.costPrice ? parseFloat(newProduct.costPrice.replace(',', '.')) : 0,
          retail_price: parseFloat(newProduct.retailPrice.replace(',', '.')),
          compare_price: newProduct.comparePrice ? parseFloat(newProduct.comparePrice.replace(',', '.')) : undefined,
          image: newProduct.image,
          category_id: newProduct.category || undefined,
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
          category: '',
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
        const newStatus = product.status === 'published' ? 'draft' : 'published'
        await updateProduct(id, { status: newStatus })
      } catch (error) {
        console.error('Error updating product status:', error)
      }
    }
  }

  const updateMetadata = (key: string, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }))
  }

  if (productsLoading || categoriesLoading || metadataLoading) {
    return (
      <AdminGuard>
        <AdminPanel>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Se încarcă...</p>
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
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Administrare Produse (Supabase)</h1>
            <p className="text-orange-100">
              Gestionează produsele din magazin
            </p>
          </div>

          {/* Add Product Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Produse ({products.length})
            </h2>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă produs</span>
            </button>
          </div>

          {/* Add/Edit Product Form */}
          {(isAddingProduct || editingProduct) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative z-20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Editează produs' : 'Adaugă produs nou'}
                </h3>
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
                      category: '',
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titlu *
                  </label>
                  <input
                    type="text"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Numele produsului"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorie
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Selectează o categorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț de cost (MDL)
                  </label>
                  <input
                    type="text"
                    value={newProduct.costPrice}
                    onChange={(e) => handlePriceInput(e.target.value, 'costPrice')}
                    className="input-field"
                    placeholder="100,50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Exemplu: 100,50 sau 100.50</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț de vânzare (MDL) *
                  </label>
                  <input
                    type="text"
                    value={newProduct.retailPrice}
                    onChange={(e) => handlePriceInput(e.target.value, 'retailPrice')}
                    className="input-field"
                    placeholder="150,00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Exemplu: 150,00 sau 150.00</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț de comparație (MDL)
                  </label>
                  <input
                    type="text"
                    value={newProduct.comparePrice}
                    onChange={(e) => handlePriceInput(e.target.value, 'comparePrice')}
                    className="input-field"
                    placeholder="200,00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Preț original pentru reducere</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stoc
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="input-field"
                    placeholder="10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagine URL
                  </label>
                  <div className="relative">
                  <input
                    type="url"
                    value={newProduct.image}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className={`input-field ${isConvertingUrl ? 'border-orange-300 bg-orange-50' : ''}`}
                      placeholder="https://example.com/image.jpg sau https://drive.google.com/file/d/ID/view"
                    />
                    {isConvertingUrl && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {isConvertingUrl 
                      ? '🔄 Se convertește link-ul Google Drive...' 
                      : 'Link-urile Google Drive se vor converti automat în formatul corect după 2 secunde'
                    }
                  </p>
                  
                  {/* Превью изображения */}
                  {newProduct.image && (
                    <div className="mt-3 relative z-10">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Previzualizare imagine:</h4>
                      <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border">
                        <Image
                          src={newProduct.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="128px"
                          onError={() => {
                            // Fallback image будет показан автоматически
                          }}
                        />
                        {/* Fallback изображение */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-xs text-gray-500">Imagine indisponibilă</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descriere (HTML Editor)
                  </label>
                  <HtmlEditor
                    value={newProduct.description}
                    onChange={(value) => setNewProduct(prev => ({ ...prev, description: value }))}
                    placeholder="Scrieți descrierea detaliată a produsului..."
                    className="w-full"
                  />
                </div>
              </div>

              {/* Дополнительный отступ для кнопок */}
              <div className="h-8"></div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end space-x-3 relative z-30">
                <button
                  onClick={() => {
                    setIsAddingProduct(false)
                    setEditingProduct(null)
                  }}
                  className="btn-secondary"
                >
                  Anulează
                </button>
                <button
                  onClick={editingProduct ? handleSaveEdit : handleAddProduct}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Salvează' : 'Adaugă produs'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Lista produselor</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produs
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
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            {product.image ? (
                              <img src={product.image} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-6 h-6 bg-gray-400 rounded"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {product.description ? (
                                <div 
                                  dangerouslySetInnerHTML={{ 
                                    __html: product.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                                  }} 
                                />
                              ) : (
                                'Fără descriere'
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <span className="font-medium">{product.retail_price} MDL</span>
                          {product.compare_price && (
                            <div className="text-gray-500 line-through text-xs">
                              {product.compare_price} MDL
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleProductStatus(product.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.status === 'published' ? 'Publicat' : 'Ciornă'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="text-orange-600 hover:text-orange-900"
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