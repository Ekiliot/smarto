'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { usePaymentMethods } from '@/hooks/useData'
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  Wallet,
  Banknote
} from 'lucide-react'

export default function PaymentsPage() {
  const { paymentMethods, loading, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePaymentMethods()
  
  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [editingMethod, setEditingMethod] = useState<string | null>(null)
  const [newMethod, setNewMethod] = useState({
    name: '',
    description: '',
    type: 'card' as 'card' | 'cash' | 'bank_transfer' | 'online',
    fee: '',
    isActive: true
  })

  const handleAddMethod = async () => {
    if (newMethod.name) {
      try {
        await addPaymentMethod({
          ...newMethod,
          fee: parseFloat(newMethod.fee) || 0
        })
        setNewMethod({
          name: '',
          description: '',
          type: 'card',
          fee: '',
          isActive: true
        })
        setIsAddingMethod(false)
      } catch (error) {
        console.error('Error adding payment method:', error)
      }
    }
  }

  const handleEditMethod = (methodId: string) => {
    setEditingMethod(methodId)
  }

  const handleSaveEdit = async (methodId: string, updates: any) => {
    try {
      await updatePaymentMethod(methodId, updates)
      setEditingMethod(null)
    } catch (error) {
      console.error('Error updating payment method:', error)
    }
  }

  const handleDeleteMethod = async (methodId: string) => {
    if (confirm('Sigur doriți să ștergeți această metodă de plată?')) {
      try {
        await deletePaymentMethod(methodId)
      } catch (error) {
        console.error('Error deleting payment method:', error)
      }
    }
  }

  const toggleMethodStatus = async (methodId: string, currentStatus: boolean) => {
    try {
      await updatePaymentMethod(methodId, { isActive: !currentStatus })
    } catch (error) {
      console.error('Error updating payment method status:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-4 h-4" />
      case 'cash':
        return <Banknote className="w-4 h-4" />
      case 'bank_transfer':
        return <Wallet className="w-4 h-4" />
      case 'online':
        return <DollarSign className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'card':
        return 'Card bancar'
      case 'cash':
        return 'Numerar'
      case 'bank_transfer':
        return 'Transfer bancar'
      case 'online':
        return 'Plată online'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminPanel>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smarto-600"></div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Metode de Plată</h1>
                <p className="text-gray-600">Gestionați opțiunile de plată pentru clienți</p>
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
                  <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Metode Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentMethods.filter(m => m.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comision Mediu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentMethods.length > 0 
                      ? `${(paymentMethods.reduce((sum, m) => sum + m.fee, 0) / paymentMethods.length).toFixed(0)} MDL`
                      : '0 MDL'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Add Method Form */}
          {isAddingMethod && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Adaugă Metodă de Plată</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
                  <input
                    type="text"
                    value={newMethod.name}
                    onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                    className="input-field"
                    placeholder="Card bancar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
                  <select
                    value={newMethod.type}
                    onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value as 'card' | 'cash' | 'bank_transfer' | 'online' })}
                    className="input-field"
                  >
                    <option value="card">Card bancar</option>
                    <option value="cash">Numerar</option>
                    <option value="bank_transfer">Transfer bancar</option>
                    <option value="online">Plată online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comision (MDL)</label>
                  <input
                    type="number"
                    value={newMethod.fee}
                    onChange={(e) => setNewMethod({ ...newMethod, fee: e.target.value })}
                    className="input-field"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newMethod.isActive}
                      onChange={(e) => setNewMethod({ ...newMethod, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-smarto-600 focus:ring-smarto-500"
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
                    placeholder="Descrierea metodei de plată..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddingMethod(false)}
                  className="btn-secondary"
                >
                  Anulează
                </button>
                <button
                  onClick={handleAddMethod}
                  className="btn-primary"
                >
                  Adaugă Metodă
                </button>
              </div>
            </div>
          )}

          {/* Methods Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Metode de Plată ({paymentMethods.length})
              </h3>
            </div>
            
            {paymentMethods.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există metode de plată</h3>
                <p className="text-gray-500">Adăugați prima metodă de plată pentru a începe.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(method.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{method.name}</h4>
                            <p className="text-xs text-gray-500">{getTypeLabel(method.type)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleMethodStatus(method.id, method.isActive)}
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              method.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {method.isActive ? 'Activă' : 'Inactivă'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Comision:</span>
                          <span className="text-sm font-medium text-gray-900">{method.fee} MDL</span>
                        </div>
                        {method.description && (
                          <p className="text-sm text-gray-600 mt-2">{method.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditMethod(method.id)}
                          className="text-smarto-600 hover:text-smarto-900 p-1"
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