'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xhanamgrezfiahhxaqn.supabase.co',
  'sb_publishable_GXE8Q6ifnCuhqDT3rJOQFA_JQbSK9b9'
);

export default function AddKindergartenWithUpload() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) {
      setMessage('Please enter kindergarten name and select a file.');
      return;
    }

    try {
      setLoading(true);
      setMessage('Uploading file and saving data...');

      const fileName = '${Date.now()}-${file.name};'
      const { error: uploadError } = await supabase.storage
        .from('kindergarten-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('kindergarten-files')
        .getPublicUrl(fileName);

      const fileUrl = publicUrlData.publicUrl;

      const { error: dbError } = await supabase
        .from('kindergartens')
        .insert([
          { 
            name: name, 
            description: description, 
            location: location,
            file_url: fileUrl 
          }
        ]);

      if (dbError) throw dbError;

      setMessage('Kindergarten added and file uploaded successfully!');
      setName('');
      setDescription('');
      setLocation('');
      setFile(null);

    } catch (error: any) {
      setMessage('Error: ${error.message}');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', direction: 'rtl', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>بوابة الروضة: تسجيل ورفع الملفات</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#f9f9f9', padding: '25px', borderRadius: '10px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اسم الروضة:</label>
          <input 
            type="text" 
            placeholder="مثال: روضة البراعم الصغار" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>وصف الروضة / الأنشطة:</label>
          <textarea 
            placeholder="نبذة عن الأنشطة والخدمات..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', minHeight: '80px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الموقع / الحي:</label>
          <input 
            type="text" 
            placeholder="مثال: حي الياسمين" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>إرفاق الملفات الضخمة:</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #ccc', borderRadius: '6px' }}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '14px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Save and Upload'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}