'use client'

import { useState } from 'react'
import { Plus, X, Edit, Trash2, Save, PlusCircle, Database } from 'lucide-react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useMetadataTypes } from '@/hooks/useSupabase'

export default function AdminMetadataPage() {
  const { metadataTypes: metadataItems, loading, addMetadataType, updateMetadataType, deleteMetadataType } = useMetadataTypes()
  
  const [isAddingMetadata, setIsAddingMetadata] = useState(false)
  const [editingMetadata, setEditingMetadata] = useState<string | null>(null)
  const [newMetadata, setNewMetadata] = useState({
    name: '',
    type: 'text' as 'text' | 'number' | 'boolean' | 'select',
    options: '',
    isCustom: false
  })

  const metadataTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Număr' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'select', label: 'Select' }
  ]

  const handleAddMetadata = async () => {
    if (newMetadata.name) {
      try {
        await addMetadataType({
          name: newMetadata.name,
          type: newMetadata.type,
          options: newMetadata.options ? newMetadata.options.split(',').map(v => v.trim()).filter(v => v) : [],
          is_custom: newMetadata.isCustom
        })
        
        setNewMetadata({
          name: '',
          type: 'text',
          options: '',
          isCustom: false
        })
        setIsAddingMetadata(false)
      } catch (error) {
        console.error('Error adding metadata:', error)
      }
    }
  }

  const handleEditMetadata = (id: string) => {
    const metadataItem = metadataItems.find(m => m.id === id)
    if (metadataItem) {
      setNewMetadata({
        name: metadataItem.name,
        type: metadataItem.type,
        options: metadataItem.options.join(', '),
        isCustom: metadataItem.is_custom
      })
      setEditingMetadata(id)
    }
  }

  const handleSaveEdit = async () => {
    if (editingMetadata && newMetadata.name) {
      try {
        await updateMetadataType(editingMetadata, {
          name: newMetadata.name,
          type: newMetadata.type,
          options: newMetadata.options ? newMetadata.options.split(',').map(v => v.trim()).filter(v => v) : [],
          is_custom: newMetadata.isCustom
        })
        
        setNewMetadata({
          name: '',
          type: 'text',
          options: '',
          isCustom: false
        })
        setEditingMetadata(null)
      } catch (error) {
        console.error('Error updating metadata:', error)
      }
    }
  }

  const handleDeleteMetadata = async (id: string) => {
    if (confirm('Sigur doriți să ștergeți această metadată?')) {
      try {
        await deleteMetadataType(id)
      } catch (error) {
        console.error('Error deleting metadata:', error)
      }
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminPanel>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Administrare Metadate</h1>
              <p className="text-gray-600">Gestionează tipurile de metadate pentru produse</p>
            </div>
            <button
              onClick={() => setIsAddingMetadata(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă Metadată</span>
            </button>
          </div>

          {/* Add/Edit Metadata Form */}
          {(isAddingMetadata || editingMetadata) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingMetadata ? 'Editează Metadată' : 'Adaugă Metadată Nouă'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddingMetadata(false)
                    setEditingMetadata(null)
                    setNewMetadata({
                      name: '',
                      type: 'text',
                      options: '',
                      isCustom: false
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
                    Nume metadată *
                  </label>
                  <input
                    type="text"
                    value={newMetadata.name}
                    onChange={(e) => setNewMetadata({...newMetadata, name: e.target.value})}
                    className="input-field"
                    placeholder="ex: Material, Culoare, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip metadată
                  </label>
                  <select
                    value={newMetadata.type}
                    onChange={(e) => setNewMetadata({...newMetadata, type: e.target.value as 'text' | 'number' | 'boolean' | 'select'})}
                    className="input-field"
                  >
                    {metadataTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {newMetadata.type === 'select' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opțiuni (separate prin virgulă)
                    </label>
                    <input
                      type="text"
                      value={newMetadata.options}
                      onChange={(e) => setNewMetadata({...newMetadata, options: e.target.value})}
                      className="input-field"
                      placeholder="ex: Alb, Negru, Gri, Albastru"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Introduceți opțiunile posibile, separate prin virgulă
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setări
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newMetadata.isCustom}
                        onChange={(e) => setNewMetadata({...newMetadata, isCustom: e.target.checked})}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Metadată personalizată</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddingMetadata(false)
                    setEditingMetadata(null)
                  }}
                  className="btn-secondary"
                >
                  Anulează
                </button>
                <button
                  onClick={editingMetadata ? handleSaveEdit : handleAddMetadata}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMetadata ? 'Salvează' : 'Adaugă Metadată'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Metadata List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Metadate ({metadataItems.length})
              </h2>
            </div>
            
            {metadataItems.length === 0 ? (
              <div className="p-12 text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există metadate</h3>
                <p className="text-gray-500">Adăugați prima metadată pentru a începe.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {metadataItems.map((metadata) => (
                  <div key={metadata.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{metadata.name}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            metadata.is_custom 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {metadata.is_custom ? 'Personalizată' : 'Predefinită'}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {metadata.type}
                          </span>
                        </div>
                        {metadata.options.length > 0 && (
                          <p className="text-sm text-gray-600 mt-2">
                            Opțiuni: {metadata.options.join(', ')}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditMetadata(metadata.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMetadata(metadata.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 