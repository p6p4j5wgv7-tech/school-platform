'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

// ربط Supabase (تأكدي من وضع رابط مشروعك ومفتاح الـ Anon الصحيحين هنا)
const supabaseUrl = 'https://xhanamgrezfiahhxhqqn.supabase.co'
const supabaseAnonKey = 'حطي_مفتاح_الـ_Anon_هنا'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [kindergartens, setKindergartens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // حالات تسجيل دخول المشرفات
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // التحقق من الجلسة وتسجيل الدخول
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
      setErrorMsg('خطأ في الإيميل أو كلمة المرور: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setKindergartens([])
  }

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
    <main style={{ minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', direction: 'rtl', maxWidth: '900px', margin: '0 auto', background: '#fdfdfd' }}>
      
      {/* رأس الصفحة وفيه زر دخول المشرفات المخفي بذكاء */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#0070f3', margin: 0, fontSize: '26px' }}>منصة الروضات 🎨👶</h1>
        </div>
        
        <div>
          {!session ? (
            <button 
              onClick={() => setShowLoginModal(!showLoginModal)} 
              style={{ background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#333', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
            >
              🔒 دخول المشرفات
            </button>
          ) : (
            <button 
              onClick={handleLogout} 
              style={{ padding: '8px 16px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            >
              تسجيل الخروج
            </button>
          )}
        </div>
      </div>

      {/* نافذة تسجيل الدخول البسيطة للمشرفات */}
      {showLoginModal && !session && (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>تسجيل دخول المشرفات 🔐</h3>
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ padding: '10px', flex: '1', minWidth: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              style={{ padding: '10px', flex: '1', minWidth: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
              دخول
            </button>
          </form>
          {errorMsg && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{errorMsg}</p>}
        </div>
      )}

      {/* إذا لم تكن المشرفة مسجلة دخول: عرض الواجهة الأساسية والبطاقات للروضات */}
      {!session && (
        <div>
          <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
            منستك المتكاملة لإدارة الروضات، الأنشطة، والبرامج التعليمية بكل سهولة. اختر القسم المناسب أدناه للبدء في إضافة بياناتك أو استعراضها.
          </p>

          {/* البطاقات الرئيسية للروضات والأنشطة والإعلانات */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            
            <Link href="/add-kindergarten" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '20px', background: '#white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eaeaea', height: '100%', transition: 'transform 0.2s' }}>
                <h2 style={{ color: '#0070f3', fontSize: '18px', marginTop: 0 }}>🏠 الروضات</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: 0 }}>إدارة وإضافة بيانات الروضات والملفات.</p>
              </div>
            </Link>

            <Link href="/activities" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '20px', background: '#white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eaeaea', height: '100%' }}>
                <h2 style={{ color: '#0070f3', fontSize: '18px', marginTop: 0 }}>🎨 الأنشطة</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: 0 }}>استعراض البرامج والأنشطة الترفيهية والتعليمية.</p>
              </div>
            </Link>

            <Link href="/announcements" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '20px', background: '#white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eaeaea', height: '100%' }}>
                <h2 style={{ color: '#0070f3', fontSize: '18px', marginTop: 0 }}>📢 الإعلانات</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: 0 }}>متابعة أحدث الإعلانات والتعاميم الخاصة بالمنصة.</p>
              </div>
            </Link>

          </div>
        </div>
      )}

      {/* لوحة التحكم الخاصة بالمشرفات (تظهر تلقائياً في نفس الصفحة عند تسجيل الدخول) */}
      {session && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #d1d5db', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#0070f3', marginTop: 0 }}>📋 لوحة تحكم المشرفات</h2>
          <p style={{ fontSize: '14px', color: '#555' }}>أهلاً بكِ، أنتِ مسجلة دخول بالإيميل: <strong>{session.user.email}</strong></p>

          {loading ? (
            <p>جاري تحميل بيانات الروضات...</p>
          ) : kindergartens.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>لا توجد بيانات مسجلة حالياً، أو أن إيميلك غير مصرح له بالعرض.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>اسم الروضة</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>تفاصيل الملفات والبيانات</th>
                  </tr>
                </thead>
                <tbody>
                  {kindergartens.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                        {item.name || item.kindergarten_name || 'روضة'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px', background: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </main>
  )
}