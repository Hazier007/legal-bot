export default function Navbar() {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              CollectLegal.be
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Prijzen</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Reviews</a>
          </div>

          {/* Login/Register */}
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Inloggen
            </a>
            <a 
              href="/register" 
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
            >
              Registreren
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
