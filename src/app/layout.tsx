import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '매일 언어 연습',
  description: '영어, 스페인어, 중국어, 일본어 문장을 매일 듣고 말하며 연습하는 앱',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
