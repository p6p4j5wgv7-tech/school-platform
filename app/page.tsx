import Link from 'next/link';
export default function Home() { return ( <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50 text-gray-800"> <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm"> <h1 className="text-4xl font-bold text-center text-blue-600 mb-4"> مرحباً بكم في منصة الروضات 🎨👶 </h1> <p className="text-center text-lg text-gray-600 mb-8"> منصتك المتكاملة لإدارة الروضات، الأنشطة، والبرامج التعليمية بكل سهولة. </p>

JavaScript
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {/* بطاقة الروضات */}
      <Link href="/add-kindergarten" className="p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center hover:border-blue-400 hover:shadow-lg transition block">
        <h2 className="text-xl font-semibold mb-2 text-blue-500">الروضات 🏫</h2>
        <p className="text-gray-500">إدارة وإضافة بيانات الروضات.</p>
      </Link>

      {/* بطاقة الأنشطة */}
      <Link href="/activities" className="p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center hover:border-blue-400 hover:shadow-lg transition block">
        <h2 className="text-xl font-semibold mb-2 text-blue-500">الأنشطة 🎨</h2>
        <p className="text-gray-500">استعراض البرامج والأنشطة الترفيهية والتعليمية.</p>
      </Link>
      
      {/* بطاقة الإعلانات */}
      <Link href="/announcements" className="p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center hover:border-blue-400 hover:shadow-lg transition block">
        <h2 className="text-xl font-semibold mb-2 text-blue-500">الإعلانات 📢</h2>
        <p className="text-gray-500">آخر التعاميم وأخبار الروضات للأهالي.</p>
      </Link>
    </div>
  </div>
</main>
); }