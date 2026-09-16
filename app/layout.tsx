import './globals.css';

export const metadata = {
  title: 'منصة الروضات',
  description: 'إدارة الروضات والأنشطة بكل سهولة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
 }