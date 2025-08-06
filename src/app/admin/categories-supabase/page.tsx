'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Edit, Trash2, Save, Loader2 } from 'lucide-react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useCategories } from '@/hooks/useSupabase'

export default function AdminCategoriesSupabasePage() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    is_active: true
  })
  
  // Google Drive URL converter states
  const [isConvertingUrl, setIsConvertingUrl] = useState(false)

  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.slug) {
      try {
        await addCategory({
          name: newCategory.name,
          description: newCategory.description,
          slug: newCategory.slug,
          image: newCategory.image || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
          is_active: newCategory.is_active
        })
        
        setNewCategory({
          name: '',
          description: '',
          slug: '',
          image: '',
          is_active: true
        })
        setIsAddingCategory(false)
      } catch (error) {
        console.error('Error adding category:', error)
      }
    }
  }

  const handleEditCategory = (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category) {
      setNewCategory({
        name: category.name,
        description: category.description || '',
        slug: category.slug,
        image: category.image || '',
        is_active: category.is_active
      })
      setEditingCategory(id)
    }
  }

  const handleSaveEdit = async () => {
    if (editingCategory && newCategory.name && newCategory.slug) {
      try {
        await updateCategory(editingCategory, {
          name: newCategory.name,
          description: newCategory.description,
          slug: newCategory.slug,
          image: newCategory.image,
          is_active: newCategory.is_active
        })
        
        setNewCategory({
          name: '',
          description: '',
          slug: '',
          image: '',
          is_active: true
        })
        setEditingCategory(null)
      } catch (error) {
        console.error('Error updating category:', error)
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Sigur doriți să ștergeți această categorie?')) {
      try {
        await deleteCategory(id)
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category) {
      try {
        await updateCategory(id, {
          is_active: !category.is_active
        })
      } catch (error) {
        console.error('Error updating category status:', error)
      }
    }
  }

  // Google Drive URL converter function
  const convertGoogleDriveUrl = (url: string): string => {
    // Handle different Google Drive URL formats
    if (url.includes('drive.google.com/file/d/')) {
      // Format: https://drive.google.com/file/d/FILE_ID/view
      const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`
      }
    } else if (url.includes('drive.google.com/open?id=')) {
      // Format: https://drive.google.com/open?id=FILE_ID
      const match = url.match(/id=([a-zA-Z0-9-_]+)/)
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`
      }
    } else if (url.includes('drive.google.com/uc?export=download&id=')) {
      // Format: https://drive.google.com/uc?export=download&id=FILE_ID
      const match = url.match(/id=([a-zA-Z0-9-_]+)/)
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`
      }
    } else if (url.includes('drive.google.com/uc?export=view&id=')) {
      // Already in correct format
      return url
    }
    
    return url // Return original URL if no pattern matches
  }

  // Handle image URL change with auto-conversion
  const handleImageUrlChange = (url: string) => {
    setNewCategory(prev => ({ ...prev, image: url }))
    
    // Auto-convert Google Drive URLs after 2 seconds
    if (url.includes('drive.google.com') && !url.includes('uc?export=view')) {
      setIsConvertingUrl(true)
      setTimeout(() => {
        const convertedUrl = convertGoogleDriveUrl(url)
        setNewCategory(prev => ({ ...prev, image: convertedUrl }))
        setIsConvertingUrl(false)
      }, 2000)
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminPanel>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smarto-600 mx-auto"></div>
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
          <div className="bg-gradient-to-r from-smarto-600 to-smarto-700 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Administrare Categorii (Supabase)</h1>
            <p className="text-smarto-100">
              Gestionează categoriile de produse
            </p>
          </div>

          {/* Add Category Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Categorii ({categories.length})
            </h2>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă categorie</span>
            </button>
          </div>

          {/* Add/Edit Category Form */}
          {(isAddingCategory || editingCategory) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Editează categorie' : 'Adaugă categorie nouă'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingCategory(false)
                    setEditingCategory(null)
                    setNewCategory({
                      name: '',
                      description: '',
                      slug: '',
                      image: '',
                      is_active: true
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
                    Nume *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Numele categoriei"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                    className="input-field"
                    placeholder="nume-categorie"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descriere
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="Descrierea categoriei"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagine URL
                  </label>
                  <div className="relative">
                  <input
                    type="url"
                    value={newCategory.image}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className={`input-field pr-10 ${isConvertingUrl ? 'border-orange-500 bg-orange-50' : ''}`}
                      placeholder="https://drive.google.com/file/d/... sau https://example.com/image.jpg"
                  />
                    {isConvertingUrl && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  {isConvertingUrl && (
                    <p className="mt-1 text-xs text-orange-600">
                      Se convertește link-ul Google Drive...
                    </p>
                  )}
                  
                  {/* Image Preview */}
                  {newCategory.image && !isConvertingUrl && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">Previzualizare:</p>
                      <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={newCategory.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">Imagine invalidă</div>'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCategory.is_active}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-smarto-600 shadow-sm focus:border-smarto-300 focus:ring focus:ring-smarto-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Categorie activă</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAddingCategory(false)
                    setEditingCategory(null)
                  }}
                  className="btn-secondary"
                >
                  Anulează
                </button>
                <button
                  onClick={editingCategory ? handleSaveEdit : handleAddCategory}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Salvează' : 'Adaugă categorie'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Lista categoriilor</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
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
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            {category.image ? (
                              <img src={category.image} alt={category.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-6 h-6 bg-gray-400 rounded"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{category.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {category.is_active ? 'Activă' : 'Inactivă'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCategory(category.id)}
                            className="text-smarto-600 hover:text-smarto-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
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