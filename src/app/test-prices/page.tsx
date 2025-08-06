'use client'

import { useProducts } from '@/hooks/useSupabase'
import ProductCard from '@/components/ProductCard'

export default function TestPricesPage() {
  const { products, loading } = useProducts()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Prices</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.title}</h3>
            <p>Retail Price: {product.retail_price} (type: {typeof product.retail_price})</p>
            <p>Compare Price: {product.compare_price} (type: {typeof product.compare_price})</p>
            <p>Cost Price: {product.cost_price} (type: {typeof product.cost_price})</p>
            
            <div className="mt-4">
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.retail_price}
                originalPrice={product.compare_price}
                image={product.image || ''}
                inStock={product.stock > 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 