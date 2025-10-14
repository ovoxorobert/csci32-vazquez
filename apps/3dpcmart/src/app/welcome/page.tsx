import Auth from '../components/Auth'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Welcome to Our App
      </h1>

      <Auth />
    </div>
  )
}
