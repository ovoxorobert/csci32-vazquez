import AuthForm from '../../components/AuthForm'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-4">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-2">
          Welcome to 3DPC Mart
        </h1>
        <p className="text-center text-md text-Indigo-600 mb-8">
          Sign in or create an account to start building your PC.
        </p>
        <AuthForm />
      </div>
    </div>
  )
}
