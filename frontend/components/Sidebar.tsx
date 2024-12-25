'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Brain, FileText, BarChart2, MessageCircle } from 'lucide-react'

const menuItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Smart Recommendations', icon: Brain, href: '/recommendations' },
  { name: 'Resources', icon: FileText, href: '/resources' },
  { name: 'Progress Tracker', icon: BarChart2, href: '/progress' },
  { name: 'Chatbot', icon: MessageCircle, href: '/chatbot' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        LearnPro AI
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                className={`flex items-center p-2 rounded-lg hover:bg-gray-800 ${
                  pathname === item.href ? 'bg-gray-700' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

