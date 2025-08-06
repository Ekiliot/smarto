'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { 
  useCoupons, 
  useCouponProducts, 
  useCouponCategories, 
  useProducts,
  useCategories 
} from '@/hooks/useSupabase'
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Percent,
  DollarSign,
  Truck,
  Users,
  Calendar,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react'
import { Coupon, Product, Category } from '@/types'

export default function CouponsPage() {
  const { coupons, loading, createCoupon, updateCoupon, deleteCoupon } = useCoupons()
  const { products } = useProducts()
  const { categories } = useCategories()
  const { couponProducts, addProductToCoupon, removeProductFromCoupon } = useCouponProducts()
  const { couponCategories, addCategoryToCoupon, removeCategoryFromCoupon } = useCouponCategories()

  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    title: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'shipping',
    value: 10,
    min_order_amount: 0,
    max_discount: 0,
    usage_limit: 0,
    user_type: 'all' as 'all' | 'new' | 'existing',
    new_user_days: 7,
    valid_from: new Date().toISOString().slice(0, 16),
    valid_until: '',
    is_active: true
  })
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewCoupon({ ...newCoupon, code: result })
  }

  const handleCreateCoupon = async () => {
    try {
      const couponData = {
        ...newCoupon,
        code: newCoupon.code.toUpperCase(),
        valid_from: new Date(newCoupon.valid_from).toISOString(),
        valid_until: newCoupon.valid_until ? new Date(newCoupon.valid_until).toISOString() : undefined,
        max_discount: newCoupon.max_discount || undefined,
        usage_limit: newCoupon.usage_limit || undefined
      }
      await createCoupon(couponData)
      setNewCoupon({
        code: '',
        title: '',
        description: '',
        type: 'percentage',
        value: 10,
        min_order_amount: 0,
        max_discount: 0,
        usage_limit: 0,
        user_type: 'all',
        new_user_days: 7,
        valid_from: new Date().toISOString().slice(0, 16),
        valid_until: '',
        is_active: true
      })
    } catch (error) {
      console.error('Error creating coupon:', error)
    }
  }

  const handleUpdateCoupon = async () => {
    if (!editingCoupon) return
    try {
      const couponData = {
        ...editingCoupon,
        code: editingCoupon.code.toUpperCase(),
        valid_from: new Date(editingCoupon.valid_from).toISOString(),
        valid_until: editingCoupon.valid_until ? new Date(editingCoupon.valid_until).toISOString() : undefined,
        max_discount: editingCoupon.max_discount || undefined,
        usage_limit: editingCoupon.usage_limit || undefined
      }
      await updateCoupon(editingCoupon.id, couponData)
      setEditingCoupon(null)
    } catch (error) {
      console.error('Error updating coupon:', error)
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (confirm('Sigur doriți să ștergeți acest cupon?')) {
      try {
        await deleteCoupon(id)
      } catch (error) {
        console.error('Error deleting coupon:', error)
      }
    }
  }

  const getCouponProducts = (couponId: string) => {
    const productIds = couponProducts
      .filter(cp => cp.coupon_id === couponId)
      .map(cp => cp.product_id)
    return products.filter(p => productIds.includes(p.id))
  }

  const getCouponCategories = (couponId: string) => {
    const categoryIds = couponCategories
      .filter(cc => cc.coupon_id === couponId)
      .map(cc => cc.category_id)
    return categories.filter(c => categoryIds.includes(c.id))
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'MDL'
    }).format(price).replace(',', '.')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />
      case 'fixed':
        return <DollarSign className="w-4 h-4" />
      case 'shipping':
        return <Truck className="w-4 h-4" />
      default:
        return <Tag className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-600'
      case 'fixed':
        return 'bg-green-100 text-green-600'
      case 'shipping':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <AdminGuard>
      <AdminPanel>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Tag className="w-6 h-6 mr-2" />
              Cupoane
            </h1>
            <p className="text-sm text-gray-600">
              Gestionați cupoanele și codurile de reducere
            </p>
          </div>

          {/* Create New Coupon */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Creează Cupon Nou
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cod Cupon
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: WELCOME10"
                  />
                  <button
                    onClick={generateCouponCode}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titlu
                </label>
                <input
                  type="text"
                  value={newCoupon.title}
                  onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Reducere 10%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tip Cupon
                </label>
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="percentage">Procent (%)</option>
                  <option value="fixed">Sumă fixă (MDL)</option>
                  <option value="shipping">Livrare gratuită</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valoare
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={newCoupon.type === 'percentage' ? '10' : '100'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sumă minimă comandă
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCoupon.min_order_amount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount maxim (MDL)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCoupon.max_discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, max_discount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Fără limită"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limită utilizări
                </label>
                <input
                  type="number"
                  min="0"
                  value={newCoupon.usage_limit}
                  onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Fără limită"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tip utilizator
                </label>
                <select
                  value={newCoupon.user_type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, user_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Toți utilizatorii</option>
                  <option value="new">Utilizatori noi</option>
                  <option value="existing">Utilizatori existenți</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zile utilizator nou
                </label>
                <input
                  type="number"
                  min="1"
                  value={newCoupon.new_user_days}
                  onChange={(e) => setNewCoupon({ ...newCoupon, new_user_days: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid de la
                </label>
                <input
                  type="datetime-local"
                  value={newCoupon.valid_from}
                  onChange={(e) => setNewCoupon({ ...newCoupon, valid_from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid până la
                </label>
                <input
                  type="datetime-local"
                  value={newCoupon.valid_until}
                  onChange={(e) => setNewCoupon({ ...newCoupon, valid_until: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateCoupon}
                  disabled={!newCoupon.code || !newCoupon.title}
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Creează Cupon
                </button>
              </div>
            </div>
          </div>

          {/* Coupons List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Cupoane Existente ({coupons.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Se încarcă cupoanele...</p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="p-6 text-center">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nu există cupoane create încă.</p>
              </div>
            ) : (
              <div className="divide-y">
                {coupons.map((coupon) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(coupon.type)}`}>
                          {getTypeIcon(coupon.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {editingCoupon?.id === coupon.id ? (
                              <input
                                type="text"
                                value={editingCoupon?.title || ''}
                                onChange={(e) => setEditingCoupon(editingCoupon ? { ...editingCoupon, title: e.target.value } : null)}
                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              coupon.title
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Cod: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{coupon.code}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : 
                             coupon.type === 'fixed' ? `${formatPrice(coupon.value)}` : 
                             'Livrare gratuită'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {coupon.used_count} / {coupon.usage_limit || '∞'} utilizări
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {editingCoupon?.id === coupon.id ? (
                            <>
                              <button
                                onClick={handleUpdateCoupon}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingCoupon(null)}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingCoupon(coupon)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Coupon Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coupon Products */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Produse specifice ({getCouponProducts(coupon.id).length})
                        </h4>
                        <div className="space-y-2">
                          {getCouponProducts(coupon.id).map((product) => (
                            <div key={product.id} className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-sm font-medium">{product.title}</span>
                              <button
                                onClick={() => removeProductFromCoupon(coupon.id, product.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {getCouponProducts(coupon.id).length === 0 && (
                          <p className="text-sm text-gray-500">Cupon valabil pentru toate produsele</p>
                        )}
                      </div>

                      {/* Coupon Categories */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Categorii specifice ({getCouponCategories(coupon.id).length})
                        </h4>
                        <div className="space-y-2">
                          {getCouponCategories(coupon.id).map((category) => (
                            <div key={category.id} className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-sm font-medium">{category.name}</span>
                              <button
                                onClick={() => removeCategoryFromCoupon(coupon.id, category.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {getCouponCategories(coupon.id).length === 0 && (
                          <p className="text-sm text-gray-500">Cupon valabil pentru toate categoriile</p>
                        )}
                      </div>
                    </div>

                    {/* Add Products/Categories to Coupon */}
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Adaugă Restricții</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adaugă produs specific
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addProductToCoupon(coupon.id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Selectează produs...</option>
                            {products
                              .filter(p => !getCouponProducts(coupon.id).find(cp => cp.id === p.id))
                              .map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.title} - {formatPrice(product.retail_price)}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adaugă categorie specifică
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addCategoryToCoupon(coupon.id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Selectează categorie...</option>
                            {categories
                              .filter(c => !getCouponCategories(coupon.id).find(cc => cc.id === c.id))
                              .map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Info */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-gray-900">Validitate</div>
                        <div className="text-gray-600">
                          De la: {formatDate(coupon.valid_from)}
                        </div>
                        {coupon.valid_until && (
                          <div className="text-gray-600">
                            Până la: {formatDate(coupon.valid_until)}
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-gray-900">Condiții</div>
                        <div className="text-gray-600">
                          Min comandă: {formatPrice(coupon.min_order_amount)}
                        </div>
                        <div className="text-gray-600">
                          Utilizatori: {coupon.user_type === 'all' ? 'Toți' : 
                                       coupon.user_type === 'new' ? `Noi (${coupon.new_user_days} zile)` : 
                                       'Existenți'}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-gray-900">Status</div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.is_active ? 'Activ' : 'Inactiv'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 