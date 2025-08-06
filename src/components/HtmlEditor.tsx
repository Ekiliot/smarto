'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Динамический импорт ReactQuill для избежания SSR проблем
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
})

import 'react-quill/dist/quill.snow.css'

interface HtmlEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function HtmlEditor({ value, onChange, placeholder = "Scrieți descrierea produsului...", className = "" }: HtmlEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Конфигурация модулей редактора
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  // Форматы, которые разрешены в редакторе
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ]

  if (!mounted) {
    return (
      <div className={`h-32 bg-gray-100 rounded-lg animate-pulse ${className}`}></div>
    )
  }

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
        style={{
          height: '200px'
        }}
      />
      
      {/* Предварительный просмотр HTML */}
      {value && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border relative z-10 mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Previzualizare:</h4>
          <div 
            className="text-sm text-gray-600 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  )
} 