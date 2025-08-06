'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Despre Smarto
            </h1>
            <p className="text-xl text-gray-600">
              Magazinul tău de produse pentru casa inteligentă
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Misiunea noastră
              </h2>
              
              <p className="text-gray-700 mb-6">
                La Smarto, credem că tehnologia ar trebui să facă viața mai ușoară și mai plăcută. 
                Ne dedicăm să aducem în Moldova cele mai inovatoare produse pentru casa inteligentă, 
                oferind soluții accesibile și de calitate pentru a transforma casa ta într-un spațiu 
                modern și eficient.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ce oferim
              </h3>
              
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Produse de calitate superioară pentru casa inteligentă</li>
                <li>Livrare rapidă și sigură în toată Moldova</li>
                <li>Suport tehnic specializat</li>
                <li>Garanție extinsă pentru toate produsele</li>
                <li>Prețuri competitive și oferte speciale</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                De ce să alegi Smarto?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Expertiză</h4>
                  <p className="text-gray-700 text-sm">
                    Echipa noastră de specialiști te ajută să găsești soluția perfectă pentru nevoile tale.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Calitate</h4>
                  <p className="text-gray-700 text-sm">
                    Lucrăm doar cu producători de încredere și testăm toate produsele înainte de vânzare.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Suport</h4>
                  <p className="text-gray-700 text-sm">
                    Oferim suport tehnic complet și asistență în instalare și configurare.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Garanție</h4>
                  <p className="text-gray-700 text-sm">
                    Toate produsele beneficiază de garanție extinsă și servicii post-vânzare.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Contact
              </h3>
              
              <p className="text-gray-700 mb-4">
                Pentru orice întrebări sau asistență, nu ezitați să ne contactați:
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> contact@smarto.md<br />
                  <strong>Telefon:</strong> +373 22 123 456<br />
                  <strong>Program:</strong> Luni - Vineri: 9:00 - 18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
} 