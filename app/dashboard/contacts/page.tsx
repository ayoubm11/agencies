'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Users, Mail, Phone, Building2, AlertCircle, Crown } from 'lucide-react'
import { checkDailyLimit, incrementViewCount } from '@/lib/utils'

interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  agency_id: number
  position: string
  created_at: string
}

export default function ContactsPage() {
  const { user } = useUser()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [canViewContacts, setCanViewContacts] = useState(true)

  useEffect(() => {
    if (!user) return

    // Check daily limit
    const { canView, count } = checkDailyLimit(user.id)
    setViewCount(count)
    setCanViewContacts(canView)

    if (!canView) {
      setShowUpgradeModal(true)
      setLoading(false)
      return
    }

    // Fetch contacts
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setContacts(data)
        setLoading(false)
        
        // Increment view count after successful fetch
        const newCount = incrementViewCount(user.id)
        setViewCount(newCount)
        
        if (newCount >= 50) {
          setCanViewContacts(false)
        }
      })
      .catch(err => {
        console.error('Error loading contacts:', err)
        setLoading(false)
      })
  }, [user])

  const filteredContacts = contacts.filter(contact =>
    contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Upgrade Modal
  if (showUpgradeModal) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
              <Crown className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Limite Quotidienne Atteinte
            </h2>
            <p className="text-gray-600 mb-6">
              Vous avez consulté <span className="font-bold text-indigo-600">{viewCount}/50</span> contacts aujourd'hui.
            </p>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Passez à Premium
              </h3>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Consultations illimitées</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Export des données en CSV</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Analyses avancées</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Support prioritaire 24/7</span>
                </li>
              </ul>
            </div>

            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Mettre à niveau maintenant
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              La limite sera réinitialisée demain à minuit
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
        <p className="text-gray-600">Gérez tous vos contacts professionnels</p>
      </div>

      {/* Usage Alert */}
      {viewCount >= 40 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Attention: {viewCount}/50 consultations utilisées aujourd'hui
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Il vous reste {50 - viewCount} consultations. Passez à Premium pour un accès illimité.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un contact..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <Users className="text-indigo-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Total des contacts</p>
              <p className="text-2xl font-bold text-gray-900">{filteredContacts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-amber-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Consultations restantes</p>
              <p className="text-2xl font-bold text-gray-900">{50 - viewCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {contact.first_name?.[0]}{contact.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.position}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Mail size={14} className="text-gray-400" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Phone size={14} className="text-gray-400" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <Building2 size={14} className="text-gray-400" />
                      <span>Agence #{contact.agency_id}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}