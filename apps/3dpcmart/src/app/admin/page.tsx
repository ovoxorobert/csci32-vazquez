import React from 'react'
import { LayoutDashboard } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="bg-indigo-50 p-6 rounded-full mb-6">
        <LayoutDashboard className="h-12 w-12 text-indigo-600 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-lg text-gray-600 max-w-md">
        This page is currently under development.
      </p>
      <div className="mt-8 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-500 border border-gray-200">
        Coming Soon...
      </div>
    </div>
  )
}
