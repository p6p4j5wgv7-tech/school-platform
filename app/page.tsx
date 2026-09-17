'use client'

       import { useEffect, useState } from 'react'
   import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xhanamgrezfiahhxhqqn.supabase.co'
const supabaseAnonKey = 'sb_publishable_GXE8Q6ifnCuhqDT3rJOQfA_JQbSK9b9'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'kindergartens' | 'activities' | 'announcements'>('home')

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [kindergartensData, setKindergartensData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementImage, setAnnouncementImage] = useState<File | null>(null)
  const [announcementMsg, setAnnouncementMsg] = useState('')

  const [activityTitle, setActivityTitle] = useState('')
  const [activityImage, setActivityImage] = useState<File | null>(null)
  const [activityMsg, setActivityMsg] = useState('')

  const [kegName, setKegName] = useState('')
  const [kegFile, setKegFile] = useState<File | null>(null)
  const [kegMsg, setKegMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchAdminData()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchAdminData()
        setShowLoginModal(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    })
    if (error) {
      setErrorMsg('خطأ في البريد أو كلمة المرور: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setKindergartensData([])
  }

  const fetchAdminData = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('kindergartens').select('*')
    if (!error) {
      setKindergartensData(data || [])
    }
    setLoading(false)
  }

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnnouncementMsg('جاري رفع الإعلان...')
    try {
      let imageUrl = ''
      if (announcementImage) {
        const fileExt = announcementImage.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('announcements-images').upload(fileName, announcementImage)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('announcements-images').getPublicUrl(fileName)
        imageUrl = publicUrlData.publicUrl
      }

      const { error: dbError } = await supabase.from('announcements').insert([{ title: announcementTitle, image_url: imageUrl }])
      if (dbError) throw dbError

      setAnnouncementMsg('تم نشر الإعلان بنجاح! 📢')
      setAnnouncementTitle('')
      setAnnouncementImage(null)
    } catch (err: any) {
      setAnnouncementMsg('حدث خطأ: ' + err.message)
    }
  }

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActivityMsg('جاري رفع النشاط...')
    try {
      let imageUrl = ''
      if (activityImage) {
        const fileExt = activityImage.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('activities-images').upload(fileName, activityImage)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('activities-images').getPublicUrl(fileName)
        imageUrl = publicUrlData.publicUrl
      }

      const { error: dbError } = await supabase.from('activities').insert([{ title: activityTitle, image_url: imageUrl }])
      if (dbError) throw dbError

      setActivityMsg('تم إضافة النشاط بنجاح! 🎨')
      setActivityTitle('')
      setActivityImage(null)
    } catch (err: any) {
      setActivityMsg('حدث خطأ: ' + err.message)
    }
  }

  const handleKegSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setKegMsg('جاري رفع بيانات الروضة...')
    try {
      let fileUrl = ''
      if (kegFile) {
        const fileExt = kegFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('kindergartens-files').upload(fileName, kegFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('kindergartens-files').getPublicUrl(fileName)
        fileUrl = publicUrlData.publicUrl
      }

      const { error: dbError } = await supabase.from('kindergartens').insert([{ name: kegName, file_url: fileUrl }])
      if (dbError) throw dbError

      setKegMsg('تم إرسال بيانات الروضة بنجاح! 🏡')
      setKegName('')
      setKegFile(null)
    } catch (err: any) {
      setKegMsg('حدث خطأ: ' + err.message)
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif', direction: 'rtl', maxWidth: '900px', margin: '0 auto', background: '#fdfdfd' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eaeaea', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ color: '#0070f3', margin: 0, fontSize: '24px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          منصة الروضات 🎨👶
        </h1>

        <div>
          {!session ? (
            <button 
              onClick={() => setShowLoginModal(!showLoginModal)} 
              style={{ background: '#fff', border: '1px solid #ccc', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#333' }}
            >
              🔒 دخول المشرفات
            </button>
          ) : (
            <button 
              onClick={handleLogout} 
              style={{ padding: '6px 14px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            >
              تسجيل الخروج
            </button>
          )}
        </div>
      </div>
      
      {showLoginModal && !session && (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>تسجيل دخول المشرفات 🔐</h3>
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="البريد الإلكتروني للمشرفة"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ padding: '8px', flex: '1', minWidth: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              style={{ padding: '8px', flex: '1', minWidth: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              دخول
            </button>
          </form>
          {errorMsg && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{errorMsg}</p>}
        </div>
      )}

      {session ? (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#0070f3', marginTop: 0 }}>📋 لوحة تحكم المشرفات</h2>
          <p style={{ fontSize: '14px', color: '#555' }}>مسجلة الدخول بالإيميل: <strong>{session.user.email}</strong></p>

          {loading ? (
            <p>جاري تحميل البيانات...</p>
          ) : kindergartensData.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>لا توجد بيانات مسجلة حالياً.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>اسم الروضة</th>
                    <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>الملفات والبيانات</th>
                  </tr>
                </thead>
                <tbody>
                  {kindergartensData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{item.name || 'روضة'}</td>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px' }}>{JSON.stringify(item, null, 2)}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          {activeTab === 'home' && (
            <div>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px' }}>
                مرحباً بكم في منصة الروضات المتكاملة. يرجى اختيار القسم المناسب أدناه لرفع الملفات أو استعراض الأنشطة والإعلانات:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <div onClick={() => setActiveTab('kindergartens')} style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ color: '#0070f3', marginTop: 0 }}>🏠 الروضات</h3>
                  <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>إدارة وإضافة بيانات الروضات والملفات.</p>
                </div>

                <div onClick={() => setActiveTab('activities')} style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ color: '#0070f3', marginTop: 0 }}>🎨 الأنشطة</h3>
                  <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>إضافة عناوين الأنشطة وصورها.</p>
                </div>

                <div onClick={() => setActiveTab('announcements')} style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ color: '#0070f3', marginTop: 0 }}>📢 الإعلانات</h3>
                  <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>إضافة عنوان الإعلان وصورته.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kindergartens' && (
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>← عودة للرئيسية</button>
              <h2>إضافة بيانات وملفات الروضة 🏡</h2>
              <form onSubmit={handleKegSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                <input 
                  type="text" 
                  placeholder="اسم الروضة" 
                  value={kegName} 
                  onChange={(e) => setKegName(e.target.value)} 
                  required 
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                  type="file" 
                  onChange={(e) => setKegFile(e.target.files?.[0] || null)} 
                  style={{ padding: '6px' }} 
                />
                <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>رفع بيانات الروضة</button>
              </form>
              {kegMsg && <p style={{ marginTop: '10px', color: '#333', fontSize: '14px' }}>{kegMsg}</p>}
            </div>
          )}

          {activeTab === 'activities' && (
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>← عودة للرئيسية</button>
              <h2>إضافة نشاط جديد 🎨</h2>
              <form onSubmit={handleActivitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                <input 
                  type="text" 
                  placeholder="عنوان النشاط" 
                  value={activityTitle} 
                  onChange={(e) => setActivityTitle(e.target.value)} 
                  required 
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <label style={{ fontSize: '13px', color: '#666' }}>صورة النشاط:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setActivityImage(e.target.files?.[0] || null)} 
                  style={{ padding: '6px' }} 
                />
                <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>نشر النشاط</button>
              </form>
              {activityMsg && <p style={{ marginTop: '10px', color: '#333', fontSize: '14px' }}>{activityMsg}</p>}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>← عودة للرئيسية</button>
              <h2>إضافة إعلان جديد 📢</h2>
              <form onSubmit={handleAnnouncementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                <input 
                  type="text" 
                  placeholder="عنوان الإعلان" 
                  value={announcementTitle} 
                  onChange={(e) => setAnnouncementTitle(e.target.value)} 
                  required 
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <label style={{ fontSize: '13px', color: '#666' }}>صورة الإعلان:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setAnnouncementImage(e.target.files?.[0] || null)} 
                  style={{ padding: '6px' }} 
                />
                <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>نشر الإعلان</button>
              </form>
              {announcementMsg && <p style={{ marginTop: '10px', color: '#333', fontSize: '14px' }}>{announcementMsg}</p>}
            </div>
          )}
        </div>
      )}

    </main>
  )
}
