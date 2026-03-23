import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'DevNotes — GitHub-Synced Markdown Notes',
  description: 'A developer-first notes app powered by your GitHub repository. Write in Markdown, sync automatically, own your data.',
  keywords: ['notes', 'markdown', 'github', 'developer', 'obsidian'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0d1117] text-[#e6edf3]`}>
        {children}
      </body>
    </html>
  )
}
