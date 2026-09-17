'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// ربط Supabase (تأكدي من وضع رابط مشروعك ومفتاح الـ Anon الصحيحين هنا)
const supabaseUrl = 'https://xhanamgrezfiahhxhqqn.supabase.co'
const supabaseAnonKey = 'حطي_مفتاح_الـ_Anon_هنا'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [kindergartens, setKindergartens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // حالات خاصة بتسجيل دخول المشرفات من الزر
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // التحقق من حالة تسجيل الدخول تلقائياً
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchKindergartens()
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchKindergartens()
        setShowLoginModal(false) // أول ما يسجل دخول نسكر نافذة الدخول
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // دالة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    })
    if (error) {
      setErrorMsg('خطأ في الإيميل أو كلمة المرور: ' + error.message)
    }
  }

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setKindergartens([])
  }

  // دالة جلب بيانات الروضات (محمية بسياسة قاعدة البيانات)
  const fetchKindergartens = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('kindergartens').select('*')
    if (error) {
      console.error('خطأ في جلب البيانات:', error.message)
    } else {
      setKindergartens(data || [])
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', direction: 'rtl', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* رأس الصفحة وفيه زر دخول المشرفات المخفي بذكاء */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>منصة الروضات 🎨</h1>
        
        {!session ? (
          <button 
            onClick={() => setShowLoginModal(!showLoginModal)} 
            style={{ background: 'none', border: '1px solid #ccc', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', color: '#666' }}
          >
            🔒 دخول المشرفات
          </button>
        ) : (
          <button 
            onClick={handleLogout} 
            style={{ padding: '6px 12px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
          >
            تسجيل الخروج
          </button>
        )}
      </div>

      {/* نافذة تسجيل الدخول البسيطة (تطلع بس إذا ضغطت المشرفة على الزر) */}
      {showLoginModal && !session && (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
          <h3>تسجيل دخول المشرفات 🔐</h3>
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ padding: '8px', flex: '1', minWidth: '200px' }}
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              style={{ padding: '8px', flex: '1', minWidth: '200px' }}
            />
            <button type="submit" style={{ padding: '8px 15px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              دخول
            </button>
          </form>
          {errorMsg && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{errorMsg}</p>}
        </div>
      )}

      {/* المحتوى الطبيعي للصفحة (مثلاً نموذج الروضة لرفع الملفات والبيانات) */}
      {!session && (
        <div>
          <h2>مرحباً بكم في منصة الروضات</h2>
          <p style={{ color: '#555' }}>يمكن للروضات إدخال البيانات ورفع الملفات المطلوبة بكل سهولة عبر هذه الصفحة.</p>
          {/* هنا بيكون نموذج الروضات حقكم العادي */}
        </div>
      )}

      {/* لوحة التحكم والجدول (تظهر تلقائياً هنا في نفس الصفحة فقط إذا سجلت المشرفة دخولها بنجاح) */}
      {session && (
        <div style={{ background: '#fdfdfd', padding: '20px', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
          <h2 style={{ color: '#0070f3' }}>📋 لوحة تحكم الروضات (عرض بيانات المشرفات)</h2>
          <p style={{ fontSize: '14px', color: '#666' }}>أهلاً بكِ، أنتِ مسجلة دخول بالإيميل: <strong>{session.user.email}</strong></p>

          {loading ? (
            <p>جاري تحميل بيانات الروضات...</p>
          ) : kindergartens.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>لا توجد بيانات مسجلة حالياً، أو أن إيميلك غير مصرح له بالعرض.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>اسم الروضة</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>تفاصيل الملفات والبيانات</th>
                </tr>
              </thead>
              <tbody>
                {kindergartens.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name || item.kindergarten_name || 'روضة'}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px' }}>{JSON.stringify(item, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  )
}