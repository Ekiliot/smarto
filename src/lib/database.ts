// Database simulation for development
// In production, this would be replaced with real database calls

export interface Product {
  id: string
  title: string
  description: string
  costPrice: number
  retailPrice: number
  comparePrice: number | null
  image: string
  category: string
  status: 'published' | 'draft'
  stock: number
  metadata: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  slug: string
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MetadataItem {
  id: string
  name: string
  type: string
  values: string[]
  isRequired: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  avatar?: string
  phone?: string
  address?: string
  marketingConsent: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  type: 'home' | 'pickup' | 'express'
  isActive: boolean
  estimatedDays: string
  createdAt: string
  updatedAt: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  type: 'card' | 'cash' | 'bank_transfer' | 'online'
  isActive: boolean
  fee: number
  createdAt: string
  updatedAt: string
}

class Database {
  private getStorageKey(key: string): string {
    return `smarto_${key}`
  }

  private getTimestamp(): string {
    return new Date().toISOString()
  }

  // Products
  async getProducts(): Promise<Product[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.getStorageKey('products'))
    if (!stored) {
      // Initialize with empty data
      this.saveProducts([])
      return []
    }
    
    return JSON.parse(stored)
  }

  async saveProducts(products: Product[]): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey('products'), JSON.stringify(products))
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const products = await this.getProducts()
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }
    
    products.push(newProduct)
    await this.saveProducts(products)
    return newProduct
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await this.getProducts()
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: this.getTimestamp()
    }
    
    await this.saveProducts(products)
    return products[index]
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts()
    const filtered = products.filter(p => p.id !== id)
    
    if (filtered.length === products.length) return false
    
    await this.saveProducts(filtered)
    return true
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.getStorageKey('categories'))
    if (!stored) {
      // Initialize with empty data
      this.saveCategories([])
      return []
    }
    
    return JSON.parse(stored)
  }

  async saveCategories(categories: Category[]): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey('categories'), JSON.stringify(categories))
  }

  async addCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const categories = await this.getCategories()
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }
    
    categories.push(newCategory)
    await this.saveCategories(categories)
    return newCategory
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categories = await this.getCategories()
    const index = categories.findIndex(c => c.id === id)
    
    if (index === -1) return null
    
    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: this.getTimestamp()
    }
    
    await this.saveCategories(categories)
    return categories[index]
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories()
    const filtered = categories.filter(c => c.id !== id)
    
    if (filtered.length === categories.length) return false
    
    await this.saveCategories(filtered)
    return true
  }

  // Metadata
  async getMetadata(): Promise<MetadataItem[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.getStorageKey('metadata'))
    if (!stored) {
      // Initialize with empty data
      this.saveMetadata([])
      return []
    }
    
    return JSON.parse(stored)
  }

  async saveMetadata(metadata: MetadataItem[]): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey('metadata'), JSON.stringify(metadata))
  }

  async addMetadata(metadata: Omit<MetadataItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MetadataItem> {
    const metadataItems = await this.getMetadata()
    const newMetadata: MetadataItem = {
      ...metadata,
      id: Date.now().toString(),
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }
    
    metadataItems.push(newMetadata)
    await this.saveMetadata(metadataItems)
    return newMetadata
  }

  async updateMetadata(id: string, updates: Partial<MetadataItem>): Promise<MetadataItem | null> {
    const metadataItems = await this.getMetadata()
    const index = metadataItems.findIndex(m => m.id === id)
    
    if (index === -1) return null
    
    metadataItems[index] = {
      ...metadataItems[index],
      ...updates,
      updatedAt: this.getTimestamp()
    }
    
    await this.saveMetadata(metadataItems)
    return metadataItems[index]
  }

  async deleteMetadata(id: string): Promise<boolean> {
    const metadataItems = await this.getMetadata()
    const filtered = metadataItems.filter(m => m.id !== id)
    
    if (filtered.length === metadataItems.length) return false
    
    await this.saveMetadata(filtered)
    return true
  }

  // Users
  async getUsers(): Promise<User[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.getStorageKey('users'))
    if (!stored) {
      // Initialize with empty data
      this.saveUsers([])
      return []
    }
    
    return JSON.parse(stored)
  }

  async saveUsers(users: User[]): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users))
  }

  async addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = await this.getUsers()
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }
    
    users.push(newUser)
    await this.saveUsers(users)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const index = users.findIndex(u => u.id === id)
    
    if (index === -1) return null
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: this.getTimestamp()
    }
    
    await this.saveUsers(users)
    return users[index]
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers()
    const filtered = users.filter(u => u.id !== id)
    
    if (filtered.length === users.length) return false
    
    await this.saveUsers(filtered)
    return true
  }

  // Shipping Methods
  async getShippingMethods(): Promise<ShippingMethod[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.getStorageKey('shipping'))
    if (!stored) {
      // Initialize with empty data
      this.saveShippingMethods([])
      return []
    }
    
    return JSON.parse(stored)
  }

  async saveShippingMethods(methods: ShippingMethod[]): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey('shipping'), JSON.stringify(methods))
  }

  async addShippingMethod(method: Omit<ShippingMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShippingMethod> {
    const methods = await this.getShippingMethods()
    const newMethod: ShippingMethod = {
      ...method,
      id: Date.now().toString(),
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }
    
    methods.push(newMethod)
    await this.saveShippingMethods(methods)
    return newMethod
  }

  async updateShippingMethod(id: string, updates: Partial<ShippingMethod>): Promise<ShippingMethod | null> {
    const methods = await this.getShippingMethods()
    const index = methods.findIndex(m => m.id === id)
    
    if (index === -1) return null
    
    methods[index] = {
      ...methods[index],
      ...updates,
      updatedAt: this.getTimestamp()
    }
    
    await this.saveShippingMethods(methods)
    return methods[index]
  }

  async deleteShippingMethod(id: string): Promise<boolean> {
    const methods = await this.getShippingMethods()
    const filtered = methods.filter(m => m.id !== id)
    
    if (filtered.length === methods.length) return false
    
    await this.saveShippingMethods(filtered)
    return true
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.getStorageKey('payments'))
    if (!stored) {
      // Initialize with empty data
      this.savePaymentMethods([])
      return []
    }
    
    return JSON.parse(stored)
  }

  async savePaymentMethods(methods: PaymentMethod[]): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey('payments'), JSON.stringify(methods))
  }

  async addPaymentMethod(method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod> {
    const methods = await this.getPaymentMethods()
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }
    
    methods.push(newMethod)
    await this.savePaymentMethods(methods)
    return newMethod
  }

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
    const methods = await this.getPaymentMethods()
    const index = methods.findIndex(m => m.id === id)
    
    if (index === -1) return null
    
    methods[index] = {
      ...methods[index],
      ...updates,
      updatedAt: this.getTimestamp()
    }
    
    await this.savePaymentMethods(methods)
    return methods[index]
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    const methods = await this.getPaymentMethods()
    const filtered = methods.filter(m => m.id !== id)
    
    if (filtered.length === methods.length) return false
    
    await this.savePaymentMethods(filtered)
    return true
  }

  // Export/Import for backup
  async exportData(): Promise<string> {
    const data = {
      products: await this.getProducts(),
      categories: await this.getCategories(),
      metadata: await this.getMetadata(),
      users: await this.getUsers(),
      shippingMethods: await this.getShippingMethods(),
      paymentMethods: await this.getPaymentMethods(),
      exportedAt: this.getTimestamp()
    }
    return JSON.stringify(data, null, 2)
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.products) await this.saveProducts(data.products)
      if (data.categories) await this.saveCategories(data.categories)
      if (data.metadata) await this.saveMetadata(data.metadata)
      if (data.users) await this.saveUsers(data.users)
      if (data.shippingMethods) await this.saveShippingMethods(data.shippingMethods)
      if (data.paymentMethods) await this.savePaymentMethods(data.paymentMethods)
    } catch (error) {
      throw new Error('Invalid data format')
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.getStorageKey('products'))
    localStorage.removeItem(this.getStorageKey('categories'))
    localStorage.removeItem(this.getStorageKey('metadata'))
    localStorage.removeItem(this.getStorageKey('users'))
    localStorage.removeItem(this.getStorageKey('shipping'))
    localStorage.removeItem(this.getStorageKey('payments'))
  }
}

// Singleton instance
export const db = new Database()

// For production, you would replace this with real API calls
export const api = {
  // Products
  getProducts: () => db.getProducts(),
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => db.addProduct(product),
  updateProduct: (id: string, updates: Partial<Product>) => db.updateProduct(id, updates),
  deleteProduct: (id: string) => db.deleteProduct(id),

  // Categories
  getCategories: () => db.getCategories(),
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => db.addCategory(category),
  updateCategory: (id: string, updates: Partial<Category>) => db.updateCategory(id, updates),
  deleteCategory: (id: string) => db.deleteCategory(id),

  // Metadata
  getMetadata: () => db.getMetadata(),
  addMetadata: (metadata: Omit<MetadataItem, 'id' | 'createdAt' | 'updatedAt'>) => db.addMetadata(metadata),
  updateMetadata: (id: string, updates: Partial<MetadataItem>) => db.updateMetadata(id, updates),
  deleteMetadata: (id: string) => db.deleteMetadata(id),

  // Users
  getUsers: () => db.getUsers(),
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => db.addUser(user),
  updateUser: (id: string, updates: Partial<User>) => db.updateUser(id, updates),
  deleteUser: (id: string) => db.deleteUser(id),

  // Shipping Methods
  getShippingMethods: () => db.getShippingMethods(),
  addShippingMethod: (method: Omit<ShippingMethod, 'id' | 'createdAt' | 'updatedAt'>) => db.addShippingMethod(method),
  updateShippingMethod: (id: string, updates: Partial<ShippingMethod>) => db.updateShippingMethod(id, updates),
  deleteShippingMethod: (id: string) => db.deleteShippingMethod(id),

  // Payment Methods
  getPaymentMethods: () => db.getPaymentMethods(),
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => db.addPaymentMethod(method),
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => db.updatePaymentMethod(id, updates),
  deletePaymentMethod: (id: string) => db.deletePaymentMethod(id),

  // Backup
  exportData: () => db.exportData(),
  importData: (jsonData: string) => db.importData(jsonData),
  clearAll: () => db.clearAll()
} 