'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// ربط Supabase باستخدام المتغيرات البيئية
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AddKindergartenWithUpload() {
  const [kindergartenName, setKindergartenName] = useState('')
  const [managerName, setManagerName] = useState('')
  const [fileBase64, setFileBase64] = useState('')
  const [fileName, setFileName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // دالة لتحويل الملف المرفوع إلى Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFileBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // إدخال البيانات مباشرة في جدول kindergartens بدون أي سلال تخزين
      const { error } = await supabase
        .from('kindergartens')
        .insert([
          {
            name: kindergartenName,
            manager: managerName,
            file_name: fileName,
            file_data: fileBase64, // تخزين الملف كـ Base64 نصي
          }
        ])

      if (error) {
        throw error
      }

      setMessage('تم رفع بيانات الروضة وحفظ الملف بنجاح تام!')
      setKindergartenName('')
      setManagerName('')
      setFileBase64('')
      setFileName('')
    } catch (err: any) {
      setMessage(`حدث خطأ: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Tahoma' }}>
      <h2>منصة الروضات - إضافة بيانات وملفات الروضة</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>اسم الروضة:</label>
          <input
            type="text"
            value={kindergartenName}
            onChange={(e) => setKindergartenName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>اسم المديرة / المشرفة:</label>
          <input
            type="text"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>اختيار الملف:</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'جاري الرفع...' : 'رفع بيانات الروضة'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          {message}
        </p>
      )}
    </div>
  )
}
