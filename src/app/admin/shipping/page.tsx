'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useShippingMethods } from '@/hooks/useSupabase'
import { 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  Home,
  Package,
  Clock,
  Save,
  X,
  Loader2
} from 'lucide-react'

export default function ShippingPage() {
  const { shippingMethods, loading, addShippingMethod, updateShippingMethod, deleteShippingMethod } = useShippingMethods()
  
  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [editingMethod, setEditingMethod] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newMethod, setNewMethod] = useState({
    name: '',
    description: '',
    type: 'home' as 'home' | 'pickup' | 'express',
    minOrderAmount: '',
    maxOrderAmount: '',
    shippingCost: '',
    freeShippingThreshold: '',
    estimatedDays: '',
    isActive: true
  })

  const handleAddMethod = async () => {
    // Валидация формы
    if (!newMethod.name.trim()) {
      setError('Numele metodei de livrare este obligatoriu.')
      return
    }
    
    if (!newMethod.shippingCost || parseFloat(newMethod.shippingCost) < 0) {
      setError('Costul de livrare trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.minOrderAmount && parseFloat(newMethod.minOrderAmount) < 0) {
      setError('Suma minimă de comandă trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.maxOrderAmount && parseFloat(newMethod.maxOrderAmount) < 0) {
      setError('Suma maximă de comandă trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.freeShippingThreshold && parseFloat(newMethod.freeShippingThreshold) < 0) {
      setError('Pragul pentru livrare gratuită trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.estimatedDays && parseInt(newMethod.estimatedDays) < 0) {
      setError('Numărul de zile estimate trebuie să fie un număr pozitiv.')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const shippingMethodData: any = {
        name: newMethod.name.trim(),
        description: newMethod.description.trim(),
        type: newMethod.type,
        min_order_amount: parseFloat(newMethod.minOrderAmount) || 0,
        shipping_cost: parseFloat(newMethod.shippingCost),
        is_active: newMethod.isActive
      }

      // Добавляем опциональные поля только если они не пустые
      if (newMethod.maxOrderAmount) {
        shippingMethodData.max_order_amount = parseFloat(newMethod.maxOrderAmount)
      }
      if (newMethod.freeShippingThreshold) {
        shippingMethodData.free_shipping_threshold = parseFloat(newMethod.freeShippingThreshold)
      }
      if (newMethod.estimatedDays) {
        shippingMethodData.estimated_days = parseInt(newMethod.estimatedDays)
      }

      await addShippingMethod(shippingMethodData)
      
      setNewMethod({
        name: '',
        description: '',
        type: 'home',
        minOrderAmount: '',
        maxOrderAmount: '',
        shippingCost: '',
        freeShippingThreshold: '',
        estimatedDays: '',
        isActive: true
      })
      setIsAddingMethod(false)
    } catch (error) {
      console.error('Error adding shipping method:', error)
      setError('Eroare la adăugarea metodei de livrare. Încercați din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditMethod = (methodId: string) => {
    const method = shippingMethods.find(m => m.id === methodId)
    if (method) {
      setNewMethod({
        name: method.name,
        description: method.description || '',
        type: method.type,
        minOrderAmount: method.min_order_amount.toString(),
        maxOrderAmount: method.max_order_amount?.toString() || '',
        shippingCost: method.shipping_cost.toString(),
        freeShippingThreshold: method.free_shipping_threshold?.toString() || '',
        estimatedDays: method.estimated_days?.toString() || '',
        isActive: method.is_active
      })
      setEditingMethod(methodId)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingMethod) {
      setError('Eroare: nu s-a găsit metoda de editare.')
      return
    }
    
    // Валидация формы
    if (!newMethod.name.trim()) {
      setError('Numele metodei de livrare este obligatoriu.')
      return
    }
    
    if (!newMethod.shippingCost || parseFloat(newMethod.shippingCost) < 0) {
      setError('Costul de livrare trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.minOrderAmount && parseFloat(newMethod.minOrderAmount) < 0) {
      setError('Suma minimă de comandă trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.maxOrderAmount && parseFloat(newMethod.maxOrderAmount) < 0) {
      setError('Suma maximă de comandă trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.freeShippingThreshold && parseFloat(newMethod.freeShippingThreshold) < 0) {
      setError('Pragul pentru livrare gratuită trebuie să fie un număr pozitiv.')
      return
    }
    
    if (newMethod.estimatedDays && parseInt(newMethod.estimatedDays) < 0) {
      setError('Numărul de zile estimate trebuie să fie un număr pozitiv.')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const shippingMethodData: any = {
        name: newMethod.name.trim(),
        description: newMethod.description.trim(),
        type: newMethod.type,
        min_order_amount: parseFloat(newMethod.minOrderAmount) || 0,
        shipping_cost: parseFloat(newMethod.shippingCost),
        is_active: newMethod.isActive
      }

      // Добавляем опциональные поля только если они не пустые
      if (newMethod.maxOrderAmount) {
        shippingMethodData.max_order_amount = parseFloat(newMethod.maxOrderAmount)
      }
      if (newMethod.freeShippingThreshold) {
        shippingMethodData.free_shipping_threshold = parseFloat(newMethod.freeShippingThreshold)
      }
      if (newMethod.estimatedDays) {
        shippingMethodData.estimated_days = parseInt(newMethod.estimatedDays)
      }

      await updateShippingMethod(editingMethod, shippingMethodData)
      
      setNewMethod({
        name: '',
        description: '',
        type: 'home',
        minOrderAmount: '',
        maxOrderAmount: '',
        shippingCost: '',
        freeShippingThreshold: '',
        estimatedDays: '',
        isActive: true
      })
      setEditingMethod(null)
    } catch (error) {
      console.error('Error updating shipping method:', error)
      setError('Eroare la actualizarea metodei de livrare. Încercați din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMethod = async (methodId: string) => {
    if (confirm('Sigur doriți să ștergeți această metodă de livrare?')) {
      try {
        await deleteShippingMethod(methodId)
      } catch (error) {
        console.error('Error deleting shipping method:', error)
      }
    }
  }

  const toggleMethodStatus = async (methodId: string, currentStatus: boolean) => {
    try {
      await updateShippingMethod(methodId, { is_active: !currentStatus })
    } catch (error) {
      console.error('Error updating shipping method status:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4" />
      case 'pickup':
        return <Package className="w-4 h-4" />
      case 'express':
        return <Clock className="w-4 h-4" />
      default:
        return <Truck className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Livrare la domiciliu'
      case 'pickup':
        return 'Ridicare personală'
      case 'express':
        return 'Livrare expresă'
      default:
        return type
    }
  }

  const formatPriceRange = (min: number, max?: number) => {
    if (!max) return `${min}+ MDL`
    return `${min} - ${max} MDL`
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminPanel>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Metode de Livrare</h1>
                <p className="text-gray-600">Gestionați opțiunile de livrare cu intervale de preț</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingMethod(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă Metodă</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Metode</p>
                  <p className="text-2xl font-bold text-gray-900">{shippingMethods.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Metode Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {shippingMethods.filter(m => m.is_active).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Preț Mediu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {shippingMethods.length > 0 
                      ? `${(shippingMethods.reduce((sum, m) => sum + m.shipping_cost, 0) / shippingMethods.length).toFixed(0)} MDL`
                      : '0 MDL'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Method Form */}
          {(isAddingMethod || editingMethod) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingMethod ? 'Editează Metoda de Livrare' : 'Adaugă Metodă de Livrare'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingMethod(false)
                    setEditingMethod(null)
                    setNewMethod({
                      name: '',
                      description: '',
                      type: 'home',
                      minOrderAmount: '',
                      maxOrderAmount: '',
                      shippingCost: '',
                      freeShippingThreshold: '',
                      estimatedDays: '',
                      isActive: true
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
                  <input
                    type="text"
                    value={newMethod.name}
                    onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                    className="input-field"
                    placeholder="Livrare standard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
                  <select
                    value={newMethod.type}
                    onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value as 'home' | 'pickup' | 'express' })}
                    className="input-field"
                  >
                    <option value="home">Livrare la domiciliu</option>
                    <option value="pickup">Ridicare personală</option>
                    <option value="express">Livrare expresă</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suma minimă comandă (MDL)</label>
                  <input
                    type="number"
                    value={newMethod.minOrderAmount}
                    onChange={(e) => setNewMethod({ ...newMethod, minOrderAmount: e.target.value })}
                    className="input-field"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suma maximă comandă (MDL)</label>
                  <input
                    type="number"
                    value={newMethod.maxOrderAmount}
                    onChange={(e) => setNewMethod({ ...newMethod, maxOrderAmount: e.target.value })}
                    className="input-field"
                    placeholder="Lăsați gol pentru fără limită"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost livrare (MDL)</label>
                  <input
                    type="number"
                    value={newMethod.shippingCost}
                    onChange={(e) => setNewMethod({ ...newMethod, shippingCost: e.target.value })}
                    className="input-field"
                    placeholder="30"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prag livrare gratuită (MDL)</label>
                  <input
                    type="number"
                    value={newMethod.freeShippingThreshold}
                    onChange={(e) => setNewMethod({ ...newMethod, freeShippingThreshold: e.target.value })}
                    className="input-field"
                    placeholder="500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zile estimate</label>
                  <input
                    type="number"
                    value={newMethod.estimatedDays}
                    onChange={(e) => setNewMethod({ ...newMethod, estimatedDays: e.target.value })}
                    className="input-field"
                    placeholder="2"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newMethod.isActive}
                      onChange={(e) => setNewMethod({ ...newMethod, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Activă</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descriere</label>
                  <textarea
                    value={newMethod.description}
                    onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Descrierea metodei de livrare..."
                  />
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddingMethod(false)
                    setEditingMethod(null)
                    setError(null)
                  }}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Anulează
                </button>
                <button
                  onClick={editingMethod ? handleSaveEdit : handleAddMethod}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Se salvează...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingMethod ? 'Salvează' : 'Adaugă Metodă'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Methods Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Metode de Livrare ({shippingMethods.length})
              </h3>
            </div>
            
            {shippingMethods.length === 0 ? (
              <div className="p-12 text-center">
                <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există metode de livrare</h3>
                <p className="text-gray-500">Adăugați prima metodă de livrare pentru a începe.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shippingMethods.map((method) => (
                    <div key={method.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(method.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{method.name}</h4>
                            <p className="text-xs text-gray-500">{getTypeLabel(method.type)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleMethodStatus(method.id, method.is_active)}
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              method.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {method.is_active ? 'Activă' : 'Inactivă'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Interval comandă:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPriceRange(method.min_order_amount, method.max_order_amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cost livrare:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {method.shipping_cost === 0 ? 'Gratuită' : `${method.shipping_cost} MDL`}
                          </span>
                        </div>
                        {method.free_shipping_threshold && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Livrare gratuită:</span>
                            <span className="text-sm text-green-600 font-medium">
                              Peste {method.free_shipping_threshold} MDL
                            </span>
                          </div>
                        )}
                        {method.estimated_days && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Timp:</span>
                            <span className="text-sm text-gray-900">{method.estimated_days} zile</span>
                          </div>
                        )}
                        {method.description && (
                          <p className="text-sm text-gray-600 mt-2">{method.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditMethod(method.id)}
                          className="text-orange-600 hover:text-orange-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMethod(method.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 