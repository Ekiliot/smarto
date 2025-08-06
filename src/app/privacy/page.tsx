'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi la pagina principală
          </Link>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Politica de confidențialitate
            </h1>
            <p className="text-gray-600">
              Data ultimei actualizări: 1 ianuarie 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Dispoziții generale</h2>
              <div className="space-y-3">
                <p>Această Politică de confidențialitate stabilește ordinea de procesare și protecție a datelor personale ale utilizatorilor site-ului smarto.md (denumit în continuare — «Site»), efectuată de întreprinzătorul individual Vasile Caceaun (denumit în continuare — «Vânzător»).</p>
                <p>Prin utilizarea Site-ului, Utilizatorul confirmă acordul cu această Politică. Dacă Utilizatorul nu este de acord, este obligat să se abțină de la utilizarea Site-ului.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Colectarea și procesarea datelor</h2>
              <div className="space-y-3">
                <p>2.1. Vânzătorul colectează următoarele date personale:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Numele și prenumele;</li>
                  <li>Adresa de email;</li>
                  <li>Numărul de telefon;</li>
                  <li>Adresa de livrare;</li>
                  <li>Informații despre comenzi și preferințe;</li>
                  <li>Adresa IP, tipul browserului, istoricul acțiunilor pe site (prin cookie).</li>
                </ul>
                <p>2.2. Datele sunt colectate la:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Înregistrarea pe site;</li>
                  <li>Plasarea comenzii;</li>
                  <li>Abonarea la newsletter;</li>
                  <li>Completarea formularelor de contact.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Scopurile procesării datelor</h2>
              <div className="space-y-3">
                <p>3.1. Datele personale sunt procesate în următoarele scopuri:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Procesarea și livrarea comenzilor;</li>
                  <li>Contactarea clientului cu privire la comandă;</li>
                  <li>Furnizarea suportului;</li>
                  <li>Îmbunătățirea experienței utilizatorului;</li>
                  <li>Trimiterea notificărilor despre reduceri și știri (cu acordul utilizatorului);</li>
                  <li>Scopuri juridice și contabile.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Stocarea și protecția datelor</h2>
              <div className="space-y-3">
                <p>4.1. Vânzătorul ia toate măsurile rezonabile pentru a proteja datele de la pierdere, furt, modificare sau acces neautorizat.</p>
                <p>4.2. Datele sunt stocate pe servere securizate pentru perioada necesară îndeplinirii scopurilor de procesare, sau până la momentul retragerii acordului.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Transmiterea datelor către terți</h2>
              <div className="space-y-3">
                <p>5.1. Datele personale nu sunt transmise terților, cu excepția:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Serviciilor de curierat și poștă pentru livrarea mărfurilor;</li>
                  <li>Sistemelor de plată pentru efectuarea plății;</li>
                  <li>Autorităților competente, dacă legea o cere.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Mesajele de marketing</h2>
              <div className="space-y-3">
                <p>6.1. La plasarea comenzii, înregistrare sau altă interacțiune cu Site-ul, utilizatorul dă automat acordul pentru primirea mesajelor de marketing.</p>
                <p>6.2. Utilizatorul poate renunța la newsletter în orice moment prin:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Contul personal pe site;</li>
                  <li>Link-ul «Renunță» din email;</li>
                  <li>Cererea scrisă la support@smarto.md.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Drepturile utilizatorului</h2>
              <div className="space-y-3">
                <p>Utilizatorul are dreptul să:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Primească informații despre datele sale;</li>
                  <li>Solicite corectarea, ștergerea sau blocarea datelor;</li>
                  <li>Retragă acordul pentru procesare;</li>
                  <li>Depună o plângere la Centrul Național pentru Protecția Datelor Personale (CNPD).</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Fișierele Cookie</h2>
              <div className="space-y-3">
                <p>8.1. Site-ul folosește fișiere cookie pentru analiza traficului, îmbunătățirea ușurinței de utilizare și personalizarea conținutului.</p>
                <p>8.2. Utilizatorul poate modifica setările cookie în browser-ul său. Dezactivarea cookie-urilor poate afecta funcționarea site-ului.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Modificările politicii</h2>
              <div className="space-y-3">
                <p>9.1. Vânzătorul poate modifica această Politică în orice moment. Versiunea actuală este publicată pe această pagină.</p>
                <p>9.2. Continuarea utilizării site-ului după modificări înseamnă acordul cu noua ediție a Politicii.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contacte</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>ÎP:</strong> Vasile Caceaun</p>
                <p><strong>Email:</strong> <a href="mailto:support@smarto.md" className="text-orange-600 hover:text-orange-500">support@smarto.md</a></p>
                <p><strong>Telefon:</strong> +373 600 00 000</p>
                <p><strong>Adresa:</strong> Republica Moldova, Chișinău</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 