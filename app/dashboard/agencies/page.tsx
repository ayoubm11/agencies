'use client'

import { useEffect, useState } from 'react'
import { Building2, Mail, Phone, Globe, MapPin } from 'lucide-react'

interface Agency {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  website: string
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/agencies')
      .then(res => res.json())
      .then(data => {
        setAgencies(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading agencies:', err)
        setLoading(false)
      })
  }, [])

  const filteredAgencies = agencies.filter(agency =>
    agency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.state?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agences</h1>
        <p className="text-gray-600">Gérez toutes vos agences en un seul endroit</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une agence..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-3">
          <Building2 className="text-indigo-600" size={24} />
          <div>
            <p className="text-sm text-gray-600">Total des agences</p>
            <p className="text-2xl font-bold text-gray-900">{filteredAgencies.length}</p>
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
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site Web
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Building2 className="text-indigo-600" size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {agency.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="text-gray-400 mt-0.5" size={16} />
                      <div className="text-sm text-gray-900">
                        <div>{agency.address}</div>
                        <div className="text-gray-500">
                          {agency.city}, {agency.state} {agency.zip}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Phone size={14} className="text-gray-400" />
                        <span>{agency.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Mail size={14} className="text-gray-400" />
                        <span>{agency.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <Globe size={14} />
                      <span>Visiter</span>
                    </a>
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