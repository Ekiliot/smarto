'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'
import AdminPanel from '@/components/AdminPanel'
import { useBackup } from '@/hooks/useData'
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const { exportData, importData, clearAll } = useBackup()
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `smarto-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setMessage({ type: 'success', text: 'Backup exportat cu succes!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Eroare la exportul backup-ului' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    try {
      const text = await importFile.text()
      await importData(text)
      setMessage({ type: 'success', text: 'Backup importat cu succes!' })
      setImportFile(null)
    } catch (error) {
      setMessage({ type: 'error', text: 'Eroare la importul backup-ului' })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Ești sigur că vrei să ștergi toate datele? Această acțiune nu poate fi anulată!')) {
      return
    }

    setIsClearing(true)
    try {
      await clearAll()
      setMessage({ type: 'success', text: 'Toate datele au fost șterse!' })
      // Reload page to reflect changes
      window.location.reload()
    } catch (error) {
      setMessage({ type: 'error', text: 'Eroare la ștergerea datelor' })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <AdminGuard>
      <AdminPanel>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-smarto-600 to-smarto-700 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Setări sistem</h1>
            <p className="text-smarto-100">
              Administrează backup-ul și configurația sistemului
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center space-x-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Backup Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Backup și restaurare
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Export */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Export backup</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Descarcă toate datele din sistem într-un fișier JSON pentru backup.
                </p>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Se exportă...' : 'Export backup'}</span>
                </button>
              </div>

              {/* Import */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Import backup</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Restaurează datele dintr-un fișier backup JSON.
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-smarto-50 file:text-smarto-700 hover:file:bg-smarto-100"
                  />
                  <button
                    onClick={handleImport}
                    disabled={!importFile || isImporting}
                    className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isImporting ? 'Se importă...' : 'Import'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Data Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                Ștergere date
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-900 mb-2">Șterge toate datele</h4>
                <p className="text-sm text-red-700 mb-4">
                  Această acțiune va șterge toate produsele, categoriile, utilizatorii și alte date din sistem. 
                  Această operațiune nu poate fi anulată!
                </p>
                <button
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isClearing ? 'Se șterg...' : 'Șterge toate datele'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Migration Guide */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Migrare la producție</h3>
            </div>
            <div className="p-6">
              <div className="prose prose-sm max-w-none">
                <h4>Pași pentru migrare:</h4>
                <ol>
                  <li>Exportă datele curente folosind butonul de mai sus</li>
                  <li>Configurează baza de date de producție (PostgreSQL/MySQL)</li>
                  <li>Actualizează variabilele de mediu</li>
                  <li>Importă datele în noua bază de date</li>
                  <li>Testează funcționalitatea</li>
                </ol>
                <p className="text-sm text-gray-600 mt-4">
                  Pentru instrucțiuni detaliate, consultă fișierul <code>MIGRATION.md</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminPanel>
    </AdminGuard>
  )
} 