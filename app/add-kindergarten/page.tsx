'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddKindergartenWithUpload() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [fileData, setFileData] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // تحويل الملف المرفوع إلى Base64 عشان نخزنه مباشرة في القاعدة
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFileName(uploadedFile.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFileData(reader.result as string)
      }
      reader.readAsDataURL(uploadedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!fileData) {
        setMessage('الرجاء اختيار ملف الرفع')
        setLoading(false)
        return
      }

      // حفظ البيانات والملف مباشرة في جدول kindergartens
      const { error: dbError } = await supabase
        .from('kindergartens')
        .insert([
          {
            school_name: name,
            title: description,
            file_path: fileData, // تخزين الملف كبيانات نصية
          }
        ])

      if (dbError) {
        throw dbError
      }

      setMessage('تم إضافة الروضة وحفظ الملف في قاعدة البيانات بنجاح!')
      setName('')
      setDescription('')
      setLocation('')
      setFileData('')
      setFileName('')

    } catch (error: any) {
      console.error("خطأ كامل", error)
      setMessage("حدث خطأ أثناء الحفظ: " + (error.message || ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', direction: 'rtl', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', color: '#0070f3' }}>إضافة روضة وملفات الروضة</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>اسم الروضة:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>الوصف:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>الموقع:</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>ملف الروضة (Word / PDF):</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            required
            style={{ width: '100%', padding: '10px' }}
          />
          {fileName && <p style={{ fontSize: '12px', color: 'green', marginTop: '5px' }}>تم اختيار الملف: {fileName}</p>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ وإضافة'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', padding: '10px', backgroundColor: message.includes('خطأ') ? '#ffebee' : '#e8f5e9', color: message.includes('خطأ') ? '#c62828' : '#2e7d32', borderRadius: '5px' }}>
          {message}
        </p>
      )}
    </div>
  )
}
