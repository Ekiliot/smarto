'use client'

import { useState } from 'react'
import { useOrders } from '@/hooks/useSupabase'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  DollarSign,
  User,
  Calendar,
  MapPin
} from 'lucide-react'

const statusConfig = {
  pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmat', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { label: 'În procesare', color: 'bg-purple-100 text-purple-800', icon: Package },
  shipped: { label: 'Expediat', color: 'bg-orange-100 text-orange-800', icon: Truck },
  delivered: { label: 'Livrat', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Anulat', color: 'bg-red-100 text-red-800', icon: XCircle }
}

const paymentStatusConfig = {
  pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Plătit', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Eșuat', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Rambursat', color: 'bg-gray-100 text-gray-800' }
}

export default function OrdersPage() {
  const { orders, loading, updateOrderStatus, updatePaymentStatus } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')

  // Debug: Log orders data
  console.log('Orders data:', { orders, loading, count: orders.length })

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ro-RO')
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config ? config.icon : Clock
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesPayment = filterPayment === 'all' || order.payment_status === filterPayment
    return matchesStatus && matchesPayment
  })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any)
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handlePaymentStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updatePaymentStatus(orderId, newStatus as any)
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  if (loading) {
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
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Comenzi</h1>
              <p className="text-gray-600">Gestionați toate comenzile clienților</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total comenzi</p>
                  <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">În așteptare</p>
                  <p className="text-xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Plătite</p>
                  <p className="text-xl font-bold text-gray-900">
                    {orders.filter(o => o.payment_status === 'paid').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total vânzări</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(orders.reduce((sum, o) => sum + o.total_amount, 0))} MDL
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status comandă
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Toate statusurile</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status plată
                </label>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Toate plățile</option>
                  {Object.entries(paymentStatusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Lista comenzilor ({filteredOrders.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comandă
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plată
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status)
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.order_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items?.length || 0} produse
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.name || 'Necunoscut'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className="w-4 h-4 mr-2" />
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]?.label || order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(order.total_amount)} MDL
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există comenzi</h3>
                <p className="text-gray-500">Nu au fost găsite comenzi cu filtrele selectate.</p>
              </div>
            )}
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Detalii comandă #{selectedOrder.order_number}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informații comandă</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status plată:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            paymentStatusConfig[selectedOrder.payment_status as keyof typeof paymentStatusConfig]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {paymentStatusConfig[selectedOrder.payment_status as keyof typeof paymentStatusConfig]?.label || selectedOrder.payment_status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span className="text-gray-900">{formatDate(selectedOrder.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Metodă plată:</span>
                          <span className="text-gray-900">{selectedOrder.payment_method}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Client</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nume:</span>
                          <span className="text-gray-900">{selectedOrder.user?.name || 'Necunoscut'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="text-gray-900">{selectedOrder.user?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Adresa de livrare
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-900">
                          {selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}
                        </p>
                        <p className="text-gray-600">{selectedOrder.shipping_address.address}</p>
                        <p className="text-gray-600">
                          {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}
                        </p>
                        <p className="text-gray-600">{selectedOrder.shipping_address.country}</p>
                        <p className="text-gray-600">{selectedOrder.shipping_address.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Adresa de facturare
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-900">
                          {selectedOrder.billing_address.firstName} {selectedOrder.billing_address.lastName}
                        </p>
                        <p className="text-gray-600">{selectedOrder.billing_address.address}</p>
                        <p className="text-gray-600">
                          {selectedOrder.billing_address.city}, {selectedOrder.billing_address.postalCode}
                        </p>
                        <p className="text-gray-600">{selectedOrder.billing_address.country}</p>
                        <p className="text-gray-600">{selectedOrder.billing_address.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Produse comandate</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.product?.image ? (
                              <img 
                                src={item.product.image} 
                                alt={item.product_title}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.product_title}</p>
                            <p className="text-sm text-gray-500">Cantitate: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatPrice(item.total_price)} MDL
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatPrice(item.product_price)} MDL / buc
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">{formatPrice(selectedOrder.subtotal)} MDL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Livrare:</span>
                        <span className="text-gray-900">{formatPrice(selectedOrder.shipping_cost)} MDL</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-orange-600">{formatPrice(selectedOrder.total_amount)} MDL</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Închide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 