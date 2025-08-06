# 🚀 Migrare către Producție - Smarto

Acest ghid vă va ajuta să migrați aplicația Smarto de la dezvoltare la producție.

## 📋 Cerințe Preliminare

### 1. **Baza de Date**
- PostgreSQL 12+ sau MySQL 8+
- Redis pentru cache și event bus

### 2. **Server**
- Node.js 18+
- Nginx sau Apache pentru reverse proxy
- SSL certificate (Let's Encrypt recomandat)

### 3. **Storage**
- S3-compatible storage pentru imagini (AWS S3, DigitalOcean Spaces, etc.)

## 🔄 Pași de Migrare

### 1. **Exportați Datele Curente**

Înainte de migrare, exportați toate datele din localStorage:

1. Accesați `/admin/settings` în aplicația de dezvoltare
2. Apăsați butonul "Exportă Date"
3. Salvați fișierul JSON generat

### 2. **Configurați Baza de Date**

#### PostgreSQL (Recomandat)
```sql
-- Creați baza de date
CREATE DATABASE smarto_production;

-- Creați utilizatorul
CREATE USER smarto_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE smarto_production TO smarto_user;
```

#### MySQL
```sql
-- Creați baza de date
CREATE DATABASE smarto_production;

-- Creați utilizatorul
CREATE USER 'smarto_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON smarto_production.* TO 'smarto_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. **Configurați Variabilele de Mediu**

Creați fișierul `.env` pe server:

```env
# Database
DATABASE_URL=postgresql://smarto_user:your_secure_password@localhost:5432/smarto_production
# sau pentru MySQL:
# DATABASE_URL=mysql://smarto_user:your_secure_password@localhost:3306/smarto_production

# Redis
REDIS_URL=redis://localhost:6379

# Medusa
MEDUSA_BACKEND_URL=https://your-domain.com
ADMIN_CORS=https://your-domain.com
STORE_CORS=https://your-domain.com

# Storage (S3)
S3_URL=https://your-bucket.s3.amazonaws.com
S3_BUCKET=your-bucket-name
S3_REGION=your-region
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret

# Cookie Secret
COOKIE_SECRET=your-super-secure-cookie-secret
```

### 4. **Înlocuiți Sistemul de Date**

#### 4.1 Creați API Routes

Creați fișierul `src/app/api/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres' // sau altă librărie pentru baza de date

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, costPrice, retailPrice, comparePrice, image, category, status, stock, metadata } = body
    
    const { rows } = await sql`
      INSERT INTO products (title, description, cost_price, retail_price, compare_price, image, category, status, stock, metadata, created_at, updated_at)
      VALUES (${title}, ${description}, ${costPrice}, ${retailPrice}, ${comparePrice}, ${image}, ${category}, ${status}, ${stock}, ${JSON.stringify(metadata)}, NOW(), NOW())
      RETURNING *
    `
    
    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
```

Creați fișierul `src/app/api/products/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, costPrice, retailPrice, comparePrice, image, category, status, stock, metadata } = body
    
    const { rows } = await sql`
      UPDATE products 
      SET title = ${title}, description = ${description}, cost_price = ${costPrice}, 
          retail_price = ${retailPrice}, compare_price = ${comparePrice}, image = ${image}, 
          category = ${category}, status = ${status}, stock = ${stock}, 
          metadata = ${JSON.stringify(metadata)}, updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rowCount } = await sql`DELETE FROM products WHERE id = ${params.id}`
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
```

#### 4.2 Creați Schemele de Bază de Date

```sql
-- Tabelul pentru produse
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  retail_price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  image VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  stock INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelul pentru categorii
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelul pentru metadate
CREATE TABLE metadata (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  values JSONB NOT NULL,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexuri pentru performanță
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
```

#### 4.3 Actualizați Hooks-urile

Înlocuiți `src/lib/database.ts` cu apeluri către API:

```typescript
// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export const api = {
  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE}/products`)
    return response.json()
  },
  
  addProduct: async (product: any) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    return response.json()
  },
  
  updateProduct: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  },
  
  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },
  
  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE}/categories`)
    return response.json()
  },
  
  addCategory: async (category: any) => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
    return response.json()
  },
  
  // ... și așa mai departe pentru toate operațiunile
}
```

### 5. **Deploy pe Server**

#### 5.1 Vercel (Recomandat pentru Next.js)

1. Conectați repository-ul la Vercel
2. Configurați variabilele de mediu în dashboard-ul Vercel
3. Deploy automat la fiecare push

#### 5.2 Server Tradițional

```bash
# Clonați repository-ul
git clone https://github.com/your-username/smarto.git
cd smarto

# Instalați dependențele
npm install

# Construiți aplicația
npm run build

# Rulați în producție
npm start
```

#### 5.3 Docker

Creați `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 6. **Configurați Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. **Importați Datele**

1. Accesați `/admin/settings` în noua aplicație
2. Lipiți conținutul fișierului JSON exportat
3. Apăsați "Importă Date"

## 🔧 Optimizări pentru Producție

### 1. **Cache**
```typescript
// src/lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export const cache = {
  get: async (key: string) => {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  },
  
  set: async (key: string, value: any, ttl = 3600) => {
    await redis.setex(key, ttl, JSON.stringify(value))
  }
}
```

### 2. **Rate Limiting**
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Implementați rate limiting aici
  return NextResponse.next()
}
```

### 3. **Monitoring**
- Configurați Sentry pentru error tracking
- Implementați health checks
- Monitorizați performanța cu Vercel Analytics

## 🚨 Securitate

### 1. **Autentificare**
- Implementați JWT cu refresh tokens
- Adăugați rate limiting pentru login
- Folosiți bcrypt pentru hash-ul parolelor

### 2. **Validare**
```typescript
// src/lib/validation.ts
import { z } from 'zod'

export const productSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  costPrice: z.number().min(0),
  retailPrice: z.number().min(0),
  // ... etc
})
```

### 3. **CORS**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

## 📊 Backup și Monitorizare

### 1. **Backup Automat**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump smarto_production > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### 2. **Health Check**
```typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    // Verificați conexiunea la baza de date
    await sql`SELECT 1`
    
    return NextResponse.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'unhealthy', 
      error: error.message 
    }, { status: 500 })
  }
}
```

## 🎉 Finalizare

După completarea tuturor pașilor:

1. ✅ Testați toate funcționalitățile
2. ✅ Verificați performanța
3. ✅ Configurați monitoring-ul
4. ✅ Documentați procesul de deploy
5. ✅ Creați un plan de disaster recovery

## 📞 Suport

Pentru întrebări sau probleme:
- Creați un issue în repository
- Contactați echipa de dezvoltare
- Consultați documentația oficială Next.js și Medusa.js

---

**Notă:** Acest ghid este pentru migrarea de la localStorage la o bază de date reală. Pentru integrarea completă cu Medusa.js, consultați [documentația oficială Medusa.js](https://docs.medusajs.com/). 