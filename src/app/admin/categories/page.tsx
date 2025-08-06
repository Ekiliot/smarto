'use client'

import { useState } from 'react'
import { Plus, X, Edit, Trash2, Save } from 'lucide-react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useCategories } from '@/hooks/useSupabase'

export default function AdminCategoriesPage() {
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
        console.error('Error toggling category status:', error)
      }
    }
  }

  if (loading) {
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
              <h1 className="text-2xl font-bold text-gray-900">Administrare Categorii</h1>
              <p className="text-gray-600">Gestionează categoriile de produse</p>
            </div>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă Categorie</span>
            </button>
          </div>

          {/* Add/Edit Category Form */}
          {(isAddingCategory || editingCategory) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Editează Categorie' : 'Adaugă Categorie Nouă'}
                </h2>
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
                    Nume categorie *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="input-field"
                    placeholder="ex: Iluminat inteligent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                    className="input-field"
                    placeholder="ex: lighting"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly identifier (fără spații, doar litere mici și cratime)
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descriere
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Descrierea categoriei..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL imagine
                  </label>
                  <input
                    type="url"
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({...newCategory, image: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCategory.is_active}
                        onChange={(e) => setNewCategory({...newCategory, is_active: e.target.checked})}
                        className="rounded border-gray-300 text-smarto-600 focus:ring-smarto-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Activă</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={editingCategory ? handleSaveEdit : handleAddCategory}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Salvează Modificările' : 'Adaugă Categorie'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Categories Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Categorii ({categories.length})
              </h3>
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
                      Descriere
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
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={category.image}
                              alt={category.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {category.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {category.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            category.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
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