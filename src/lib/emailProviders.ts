interface EmailProvider {
  name: string
  url: string
  icon: string
}

const emailProviders: EmailProvider[] = [
  {
    name: 'Gmail',
    url: 'https://mail.google.com',
    icon: '📧'
  },
  {
    name: 'Yahoo Mail',
    url: 'https://mail.yahoo.com',
    icon: '📧'
  },
  {
    name: 'Outlook',
    url: 'https://outlook.live.com',
    icon: '📧'
  },
  {
    name: 'Hotmail',
    url: 'https://outlook.live.com',
    icon: '📧'
  },
  {
    name: 'Yandex',
    url: 'https://mail.yandex.com',
    icon: '📧'
  },
  {
    name: 'Mail.ru',
    url: 'https://mail.ru',
    icon: '📧'
  },
  {
    name: 'ProtonMail',
    url: 'https://mail.proton.me',
    icon: '📧'
  },
  {
    name: 'Tutanota',
    url: 'https://mail.tutanota.com',
    icon: '📧'
  },
  {
    name: 'Zoho Mail',
    url: 'https://mail.zoho.com',
    icon: '📧'
  },
  {
    name: 'iCloud Mail',
    url: 'https://www.icloud.com/mail',
    icon: '📧'
  }
]

export function getEmailProvider(email: string): EmailProvider | null {
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (!domain) return null

  // Gmail
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return emailProviders.find(p => p.name === 'Gmail') || null
  }

  // Yahoo
  if (domain === 'yahoo.com' || domain === 'yahoo.ro' || domain === 'ymail.com') {
    return emailProviders.find(p => p.name === 'Yahoo Mail') || null
  }

  // Outlook/Hotmail
  if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com' || domain === 'msn.com') {
    return emailProviders.find(p => p.name === 'Outlook') || null
  }

  // Yandex
  if (domain === 'yandex.com' || domain === 'yandex.ru' || domain === 'ya.ru') {
    return emailProviders.find(p => p.name === 'Yandex') || null
  }

  // Mail.ru
  if (domain === 'mail.ru' || domain === 'inbox.ru' || domain === 'bk.ru' || domain === 'list.ru') {
    return emailProviders.find(p => p.name === 'Mail.ru') || null
  }

  // ProtonMail
  if (domain === 'protonmail.com' || domain === 'proton.me') {
    return emailProviders.find(p => p.name === 'ProtonMail') || null
  }

  // Tutanota
  if (domain === 'tutanota.com' || domain === 'tutamail.com') {
    return emailProviders.find(p => p.name === 'Tutanota') || null
  }

  // Zoho
  if (domain === 'zoho.com') {
    return emailProviders.find(p => p.name === 'Zoho Mail') || null
  }

  // iCloud
  if (domain === 'icloud.com' || domain === 'me.com' || domain === 'mac.com') {
    return emailProviders.find(p => p.name === 'iCloud Mail') || null
  }

  // Для корпоративных доменов предлагаем общие почтовые сервисы
  // или возвращаем null, чтобы показать общую инструкцию
  return null
}

export function openEmailProvider(email: string): void {
  const provider = getEmailProvider(email)
  
  if (provider) {
    // Пытаемся открыть в новой вкладке
    const newWindow = window.open(provider.url, '_blank')
    
    // Если не удалось открыть (например, на мобильном), показываем инструкцию
    if (!newWindow) {
      alert(`Deschideți ${provider.name} în browser-ul sau aplicația de email pentru a verifica link-ul de conectare.`)
    }
  } else {
    // Для неизвестных доменов показываем общую инструкцию
    alert('Deschideți aplicația de email sau browser-ul pentru a verifica email-ul.')
  }
} 