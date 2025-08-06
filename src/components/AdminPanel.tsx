'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Package,
  Tag,
  Database,
  Settings,
  BarChart3,
  Users,
  ShoppingCart,
  Home,
  ChevronRight,
  Smartphone,
  Lightbulb,
  Shield,
  Wifi,
  Truck,
  CreditCard
} from 'lucide-react'

interface AdminPanelProps {
  children: React.ReactNode
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Vizualizare generală',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconColor: 'text-blue-100'
  },
  {
    name: 'Comenzi',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Gestionare comenzi',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    iconColor: 'text-orange-100'
  },
  {
    name: 'Statistici',
    href: '/admin/statistics',
    icon: BarChart3,
    description: 'Analiza vânzărilor',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    iconColor: 'text-purple-100'
  },
  {
    name: 'Produse',
    href: '/admin/products-supabase',
    icon: Package,
    description: 'Administrare produse (Supabase)',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    iconColor: 'text-indigo-100'
  },
  {
    name: 'Categorii',
    href: '/admin/categories-supabase',
    icon: Tag,
    description: 'Administrare categorii (Supabase)',
    color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    iconColor: 'text-pink-100'
  },
  {
    name: 'Metadate',
    href: '/admin/metadata',
    icon: Database,
    description: 'Administrare metadate',
    color: 'bg-gradient-to-br from-teal-500 to-teal-600',
    iconColor: 'text-teal-100'
  },
  {
    name: 'Utilizatori',
    href: '/admin/users',
    icon: Users,
    description: 'Gestionare utilizatori',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconColor: 'text-blue-100'
  },
  {
    name: 'Livrare',
    href: '/admin/shipping',
    icon: Truck,
    description: 'Metode de livrare',
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    iconColor: 'text-green-100'
  },
  {
    name: 'Plăți',
    href: '/admin/payments',
    icon: CreditCard,
    description: 'Metode de plată',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    iconColor: 'text-purple-100'
  },
  {
    name: 'Setări',
    href: '/admin/settings',
    icon: Settings,
    description: 'Setări sistem',
    color: 'bg-gradient-to-br from-gray-500 to-gray-600',
    iconColor: 'text-gray-100'
  },
  {
    name: 'Bundle-uri',
    href: '/admin/bundles',
    icon: Package,
    description: 'Gestionați bundle-urile și ofertele speciale',
    color: 'bg-purple-500',
    iconColor: 'text-purple-100'
  },
  {
    name: 'Cupoane',
    href: '/admin/coupons',
    icon: Tag,
    description: 'Gestionați cupoanele și codurile de reducere',
    color: 'bg-red-500',
    iconColor: 'text-red-100'
  }
]

export default function AdminPanel({ children }: AdminPanelProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  // Принудительное обновление данных при изменении страницы
  useEffect(() => {
    // Принудительно обновляем страницу при переходе между разделами админ-панели
    const handleRouteChange = () => {
      // Небольшая задержка для корректного обновления
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }

    // Добавляем обработчик для принудительного обновления
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href.includes('/admin/') && !link.href.includes('#')) {
        e.preventDefault()
        const href = link.getAttribute('href')
        if (href && href !== pathname) {
          // Переходим на новую страницу и обновляем данные
          window.location.href = href
        }
      }
    }

    // Добавляем обработчик кликов
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-smarto-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Smarto Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="grid grid-cols-1 gap-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isActive ? 'ring-2 ring-white ring-opacity-50' : ''
                  }`}
                >
                  <div className={`${item.color} p-3 relative`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white opacity-20"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-white opacity-30"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <div className={`w-8 h-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center ${item.iconColor}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="text-white">
                        <div className="font-semibold text-xs mb-0.5">{item.name}</div>
                        <div className="text-xs opacity-90">{item.description}</div>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-smarto-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-smarto-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Admin Smarto</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {menuItems.find(item => item.href === pathname)?.description || 'Administrare sistem'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Înapoi la site
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 