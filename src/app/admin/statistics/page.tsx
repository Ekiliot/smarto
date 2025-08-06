'use client'

import { useState, useEffect, useMemo } from 'react'
import { useProducts } from '@/hooks/useSupabase'
import { useOrders } from '@/hooks/useSupabase'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
  Calendar,
  Target,
  Award,
  TrendingDown
} from 'lucide-react'

interface ProductStats {
  id: string
  title: string
  totalSold: number
  totalRevenue: number
  totalProfit: number
  averageOrderValue: number
}

export default function StatisticsPage() {
  const { products } = useProducts()
  const { orders } = useOrders()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  // Debug: Log data
  console.log('Statistics data:', { 
    products: products.length, 
    orders: orders.length,
    timeRange 
  })

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date()
    const timeRanges = {
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      'all': new Date(0)
    }

    const filteredOrders = orders.filter(order => 
      new Date(order.created_at) >= timeRanges[timeRange]
    )

    // Total statistics
    const totalOrders = filteredOrders.length
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const totalItems = filteredOrders.reduce((sum, order) => 
      sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0), 0
    )

    // Calculate profit for each order
    const orderProfits = filteredOrders.map(order => {
      const orderProfit = order.items?.reduce((sum, item) => {
        const product = products.find(p => p.id === item.product_id)
        if (product) {
          const costPrice = typeof product.cost_price === 'string' 
            ? parseFloat(product.cost_price) 
            : product.cost_price
          const profitPerItem = item.product_price - costPrice
          return sum + (profitPerItem * item.quantity)
        }
        return sum
      }, 0) || 0
      return orderProfit
    })

    const totalProfit = orderProfits.reduce((sum, profit) => sum + profit, 0)

    // Product statistics
    const productStats: ProductStats[] = products.map(product => {
      const productOrders = filteredOrders.filter(order =>
        order.items?.some(item => item.product_id === product.id)
      )

      const totalSold = productOrders.reduce((sum, order) => {
        const item = order.items?.find(item => item.product_id === product.id)
        return sum + (item?.quantity || 0)
      }, 0)

      const totalRevenue = productOrders.reduce((sum, order) => {
        const item = order.items?.find(item => item.product_id === product.id)
        return sum + (item?.total_price || 0)
      }, 0)

      const costPrice = typeof product.cost_price === 'string' 
        ? parseFloat(product.cost_price) 
        : product.cost_price
      const totalProfit = totalSold * (product.retail_price - costPrice)

      return {
        id: product.id,
        title: product.title,
        totalSold,
        totalRevenue,
        totalProfit,
        averageOrderValue: totalSold > 0 ? totalRevenue / totalSold : 0
      }
    }).filter(stat => stat.totalSold > 0).sort((a, b) => b.totalSold - a.totalSold)

    return {
      totalOrders,
      totalRevenue,
      totalItems,
      totalProfit,
      productStats,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    }
  }, [orders, products, timeRange])

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ro-RO', { minimumFractionDigits: 2 })
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ro-RO')
  }

  return (
    <AdminGuard>
      <AdminPanel>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Statistici</h1>
              <p className="text-gray-600">Analiza vânzărilor și performanței</p>
            </div>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="7d">Ultimele 7 zile</option>
                <option value="30d">Ultimele 30 zile</option>
                <option value="90d">Ultimele 90 zile</option>
                <option value="all">Toate timpul</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Comenzi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vânzări</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)} MDL</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit Net</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalProfit)} MDL</p>
                  <p className="text-sm text-gray-500">
                    {stats.profitMargin.toFixed(1)}% marjă
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produse Vândute</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Performanța Produselor</h2>
              <p className="text-sm text-gray-600">Top produse după vânzări</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantitate Vândută
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venituri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valoare Medie
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.productStats.slice(0, 10).map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.totalSold}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(product.totalRevenue)} MDL
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatPrice(product.totalProfit)} MDL
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(product.averageOrderValue)} MDL
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stats.productStats.length === 0 && (
              <div className="p-12 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există date de vânzări</h3>
                <p className="text-gray-500">Nu au fost înregistrate vânzări în perioada selectată.</p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Comenzi Recente</h2>
              <p className="text-sm text-gray-600">Ultimele comenzi procesate</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nr. Comandă
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.user?.name || 'Necunoscut'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total_amount)} MDL
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
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