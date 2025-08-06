'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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

        {/* Terms Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Termeni și condiții de prestare a serviciilor
            </h1>
            <p className="text-gray-600">
              Data intrării în vigoare: 1 ianuarie 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Dispoziții generale</h2>
              <div className="space-y-3">
                <p>1.1. Acești Termeni reglementează relațiile dintre întreprinzătorul individual Vasile Caceaun (denumit în continuare — «Vânzător») și persoana fizică care face o achiziție prin site-ul smarto.md (denumit în continuare — «Client»).</p>
                <p>1.2. Prin plasarea comenzii, Clientul confirmă acordul cu acești Termeni și politica de confidențialitate.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Obiectul acordului</h2>
              <div className="space-y-3">
                <p>2.1. Vânzătorul oferă Clientului posibilitatea de a achiziționa produse destinate casei inteligente prin platforma online smarto.md.</p>
                <p>2.2. Serviciile includ furnizarea informațiilor despre produse, procesarea comenzilor, livrarea acestora și, dacă este necesar, serviciul de garanție.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Procesarea și plata comenzii</h2>
              <div className="space-y-3">
                <p>3.1. Procesarea comenzii se face online.</p>
                <p>3.2. Metodele de plată disponibile:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Plata online cu cardul bancar;</li>
                  <li>Plata la primire (numerar sau card);</li>
                  <li>Transfer prin aplicații mobile sau servicii de plată.</li>
                </ul>
                <p>3.3. Toate prețurile sunt exprimate în lei moldovenești (MDL). Vânzătorul poate modifica prețurile fără notificare prealabilă, dar astfel de modificări nu afectează comenzile deja procesate.</p>
                <p>3.4. Taxele și impozitele, dacă sunt aplicabile, sunt incluse în costul produselor, în conformitate cu regimul fiscal al ÎP.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Costul și condițiile de livrare</h2>
              <div className="space-y-3">
                <p>4.1. Livrarea standard (până la 2 kg) în Moldova — 59 lei.</p>
                <p>4.2. Livrarea gratuită — la comenzi de la 220 lei.</p>
                <p>4.3. Termenul de livrare: 1–5 zile lucrătoare în Chișinău, 1–5 zile în alte regiuni.</p>
                <p>4.4. Vânzătorul își rezervă dreptul de a folosi diverse servicii de livrare.</p>
                <p>4.5. Vânzătorul poate ajusta costul livrării în funcție de greutate, volum sau distanța adresei de livrare.</p>
                <p>4.6. În cazul imposibilității livrării din vina Clientului (adresă incorectă, absența de la fața locului etc.), livrarea repetată se face pe cheltuiala Clientului.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Returnarea și garanția</h2>
              <div className="space-y-3">
                <p>5.1. Toate produsele beneficiază de o garanție de 24 de luni (2 ani), dacă nu se specifică altfel.</p>
                <p>5.2. Clientul poate returna produsul de calitate corespunzătoare în termen de 14 zile, dacă nu a fost folosit, în ambalajul original și cu bonul fiscal.</p>
                <p>5.3. Returnarea este posibilă și în cazul defectelor de fabricație sau neconformității cu descrierea.</p>
                <p>5.4. În cazul returnării din motive care nu sunt din vina Vânzătorului, cheltuielile de transport sunt suportate de Client.</p>
                <p>5.5. Rambursarea banilor se face în termen de 14 zile de la primirea produsului returnat.</p>
                <p>5.6. Vânzătorul poate refuza returnarea dacă produsul a fost folosit, deteriorat sau și-a pierdut valoarea de consum.</p>
                <p>5.7. Unele categorii de produse, cum ar fi software-ul, dispozitivele cu acces deschis la conturile cloud sau produsele de igienă personală, nu pot fi returnate dacă au fost deschise sau activate.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Răspunderea părților</h2>
              <div className="space-y-3">
                <p>6.1. Vânzătorul nu răspunde pentru întârzierile de livrare din vina serviciilor de curierat.</p>
                <p>6.2. Clientul răspunde pentru exactitatea datelor de contact furnizate.</p>
                <p>6.3. Vânzătorul își rezervă dreptul de a anula comanda în cazul datelor incorecte sau suspiciunii de fraudă.</p>
                <p>6.4. Vânzătorul nu răspunde pentru:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Deteriorarea sau stricarea produsului din vina terților după predarea la livrare;</li>
                  <li>Erorile făcute de Client la procesarea comenzii;</li>
                  <li>Încălcarea condițiilor de depozitare sau exploatare a produsului de către Client;</li>
                  <li>Neconformitatea produsului cu așteptările subiective ale Clientului, dacă produsul corespunde descrierii.</li>
                </ul>
                <p>6.5. În cazul unei situații controversate, Vânzătorul poate solicita confirmarea foto/video înainte de examinarea reclamatiei.</p>
                <p>6.6. În cazul în care Clientul face sistematic returnări nejustificate, abuzează de dreptul de returnare sau încalcă condițiile de returnare, Vânzătorul poate suspenda sau limita vânzările către acest Client, notificându-l prealabil în scris.</p>
                <p>6.7. Vânzătorul nu are obligații de compensare a daunelor cauzate de consecințe indirecte sau secundare ale utilizării produsului.</p>
                <p>6.8. Vânzătorul poate refuza returnarea sau schimbul produsului dacă clientul a încălcat condițiile de returnare, precum și în cazul în care returnarea nu corespunde cerințelor Legii privind protecția consumatorilor.</p>
                <p>6.9. Vânzătorul își rezervă dreptul de a nu servi clienții care au permis comportament ofensator, agresiv sau inadecvat.</p>
                <p>6.10. Vânzătorul poate stabili limitări asupra cantității de produse achiziționate pe o comandă sau pe un client fără a explica motivele.</p>
                <p>6.11. În cazul erorilor tehnice în descrierea sau prețul produsului, Vânzătorul poate anula comanda și oferi o alternativă sau rambursarea banilor.</p>
                <p>6.12. Orice compensare se limitează exclusiv la suma efectiv plătită pentru produs.</p>
                <p>6.13. Vânzătorul își rezervă dreptul de a suspenda sau anula servirea clienților care încalcă regulile site-ului, furnizează informații false sau desfășoară activitate suspectă.</p>
                <p>6.14. Vânzătorul nu este obligat să ofere reduceri repetate sau cadouri la comenzi repetate, chiar dacă au existat campanii promoționale în trecut.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Confidențialitatea și datele personale</h2>
              <div className="space-y-3">
                <p>7.1. Datele personale ale Clienților sunt procesate în conformitate cu Legea nr.133/2011 privind protecția datelor personale.</p>
                <p>7.2. Vânzătorul se obligă să nu transmită datele către terți, cu excepția cazurilor prevăzute de legislație și necesare pentru executarea comenzii.</p>
                <p>7.3. Clientul poate solicita ștergerea sau modificarea datelor sale personale.</p>
                <p>7.4. La procesarea comenzii, înregistrare sau alte forme de interacțiune cu site-ul, Clientul dă automat acordul pentru utilizarea datelor sale de contact (email, numărul de telefon) pentru primirea mesajelor de marketing (știri, promoții, reduceri). Vânzătorul se obligă să folosească aceste date exclusiv în cadrul propriului magazin și să nu le transmită terților.</p>
                <p>7.5. Clientul poate renunța la primirea mesajelor de marketing în orice moment, modificând setarea corespunzătoare în contul personal sau trimitând o notificare la support@smarto.md.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Modificările termenilor</h2>
              <div className="space-y-3">
                <p>8.1. Vânzătorul poate face modificări în Termeni. Versiunea actuală este întotdeauna disponibilă pe site.</p>
                <p>8.2. Noii termeni intră în vigoare din momentul publicării și nu se aplică comenzilor deja procesate fără acordul Clientului.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Rezolvarea disputelor</h2>
              <div className="space-y-3">
                <p>9.1. Toate disputele se rezolvă prin negocieri. În cazul imposibilității rezolvării — în conformitate cu legislația Republicii Moldova, în instanța competentă.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Dispoziții diverse</h2>
              <div className="space-y-3">
                <p>10.1. Vânzătorul poate limita accesul la site în timpul lucrărilor tehnice sau încălcării regulilor din partea Clientului.</p>
                <p>10.2. Utilizarea site-ului înseamnă acordul automat cu acești Termeni.</p>
                <p>10.3. În cazul descoperirii erorilor pe site (inclusiv greșeli de tipar, defecțiuni tehnice, erori de preț), Vânzătorul își rezervă dreptul de a anula comanda, notificând Clientul și oferind o soluție alternativă.</p>
                <p>10.4. Vânzătorul poate suspenda vânzările anumitor produse fără notificare prealabilă, inclusiv cazurile de lipsă în depozit sau oprire a aprovizionării.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Datele vânzătorului</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>ÎP:</strong> Vasile Caceaun</p>
                <p><strong>Numărul de înregistrare:</strong> ___________________</p>
                <p><strong>Adresa juridică:</strong> Republica Moldova, Chișinău</p>
                <p><strong>Contact:</strong> +373 600 00 000, support@smarto.md</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 