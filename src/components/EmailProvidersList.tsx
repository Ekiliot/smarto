'use client'

import { Mail, ExternalLink } from 'lucide-react'

const supportedProviders = [
  { name: 'Gmail', domain: 'gmail.com', url: 'https://mail.google.com' },
  { name: 'Yahoo Mail', domain: 'yahoo.com', url: 'https://mail.yahoo.com' },
  { name: 'Outlook', domain: 'outlook.com', url: 'https://outlook.live.com' },
  { name: 'Yandex', domain: 'yandex.com', url: 'https://mail.yandex.com' },
  { name: 'Mail.ru', domain: 'mail.ru', url: 'https://mail.ru' },
  { name: 'ProtonMail', domain: 'protonmail.com', url: 'https://mail.proton.me' },
  { name: 'iCloud', domain: 'icloud.com', url: 'https://www.icloud.com/mail' }
]

export default function EmailProvidersList() {
  const handleOpenProvider = (url: string, name: string) => {
    const newWindow = window.open(url, '_blank')
    if (!newWindow) {
      alert(`Deschideți ${name} în browser-ul sau aplicația de email.`)
    }
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Servicii de email suportate:</h4>
      <div className="grid grid-cols-2 gap-2">
        {supportedProviders.map((provider) => (
          <button
            key={provider.name}
            onClick={() => handleOpenProvider(provider.url, provider.name)}
            className="flex items-center justify-between p-2 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Mail className="w-3 h-3" />
              <span>{provider.name}</span>
            </div>
            <ExternalLink className="w-3 h-3" />
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Pentru alte servicii, deschideți aplicația de email
      </p>
    </div>
  )
} 