'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// اتصال سوبابيس (نفس المفاتيح اللي ضبطناها قبل شوي)
const supabase = createClient(
  'https://xhanamgrezfiahhxaqn.supabase.co',
  'sb_publishable_GXE8Q6ifnCuhqDT3rJOQFA_JQbSK9b9'
);

export default function UploadFiles() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('الرجاء اختيار ملف أولاً!');
      return;
    }

    try {
      setUploading(true);
      setMessage('جاري رفع الملف الضخم، يرجى الانتظار...');

      // إنشاء اسم فريد للملف عشان ما يصير تداخل
      const fileName = `${Date.now()}-${file.name}`;
      
      // رفع الملف إلى الـ Bucket اللي سويناه (kindergarten-files)
      const { data, error } = await supabase.storage
        .from('kindergarten-files')
        .upload(fileName, file);

      if (error) throw error;

      setMessage('تم رفع الملف بنجاح وتم حفظه في السحابة! 🎉');
      setFile(null);
    } catch (error: any) {
      setMessage(`خطأ أثناء الرفع: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '30px', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <h2>بوابة رفع ملفات الروضة</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button 
          type="submit" 
          disabled={uploading}
          style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {uploading ? 'جاري الرفع...' : 'رفع الملف'}
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}