'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function AddKindergartenWithUpload() {
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
  }
    try {
      if (!file) {
        throw new Error('الرجاء اختيار ملف الرفع')
      }

      // 1. إنشاء اسم فريد للملف لتجنب التعارض
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // 2. رفع الملف إلى سلة Supabase Storage بدقة
      const { error: uploadError } = await supabase.storage
        .from('school-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      // 3. جلب الرابط العام للملف المرفوع
      const { data: publicUrlData } = supabase.storage
        .from('kindergarten-files')
        .getPublicUrl(fileName)

      const fileUrl = publicUrlData.publicUrl

      // 4. حفظ بيانات الروضة مع رابط الملف في جدول قاعدة البيانات
      const { error: dbError } = await supabase
        .from('kindergartens')
        .insert([
          {
            name,
            description,
            location,
            file_url: fileUrl,
          }
        ])

      if (dbError) {
        throw dbError
      }

      setMessage('تم إضافة الروضة ورفع الملف بنجاح!')
      setName('')
      setDescription('')
      setLocation('')
      setFile(null)

    } catch (error: any) {
     console.error("خطأ كامل",error);
    setMessage("حدث خطأ:" +(error?.message || JSON.stringify(error)));
     } finally {
      setLoading(false);
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
            onChange={(e) =>setLocation(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>ملف الروضة (Word / PDF):</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'جاري الرفع والحفظ...' : 'حفظ وإضافة'}
        </button>
      </form>
     
      {message && (
        <p style={{ marginTop: '20px', padding: '10px', backgroundColor: message.includes('خطأ') ? '#ffebee' : '#e8f5e9', color: message.includes('خطأ') ? '#c62828' : '#2e7d32', borderRadius: '5px' }}>
          {message}
        </p>
      )}
    </div>
  );
}
