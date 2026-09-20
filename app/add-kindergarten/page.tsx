'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function addkindergartenWithUpload() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let fileUrl = ''

      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        // رفع الملف إلى سلة التخزين المطابقة تماماً
        const { error: uploadError } = await supabase.storage
          .from('kindergarten-files')
          .upload(fileName, file)

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage
          .from('kindergarten-files')
          .getPublicUrl(fileName)

        fileUrl = publicUrlData.publicUrl
      }

      // حفظ البيانات في الجدول بقاعدة البيانات
      const { error: dbError } = await supabase
        .from('kindergartens')
        .insert([
          {
            name,
            description,
            location,
            file_url: fileUrl,
          },
        ])

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      setMessage('kindergarten added and file uploaded successfully!')
      setName('')
      setDescription('')
      setLocation('')
      setFile(null)
    } catch (error: any) {
      setMessage(`Error: ${error.message} - ${JSON.stringify(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', direction: 'rtl', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', color: '#0070f3' }}>إضافة بيانات وملفات الروضة</h1>
      {message && (
        <div style={{ padding: '10px', marginBottom: '20px', background: message.includes('Error') ? '#ffe6e6' : '#e6ffe6', color: message.includes('Error') ? '#cc0000' : '#006600', borderRadius: '4px' }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اسم الروضة:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الوصف:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', height: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الموقع:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ملف الروضة (Word أو غيره):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '14px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
        >
          {loading ? 'جاري الحفظ والرفع...' : 'حفظ ورفع الملف'}
        </button>
      </form>
    </div>
  )
}
