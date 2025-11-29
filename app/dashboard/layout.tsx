import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Building2, Users } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-indigo-600">
                Dashboard
              </h1>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard/agencies"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                >
                  <Building2 size={18} />
                  <span>Agences</span>
                </Link>
                <Link
                  href="/dashboard/contacts"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                >
                  <Users size={18} />
                  <span>Contacts</span>
                </Link>
              </div>
            </div>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}