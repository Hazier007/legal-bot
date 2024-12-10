export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-white to-blue-50 pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Text Content */}
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Juridisch Advies met{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                AI
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Precisie
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ontdek de kracht van AI-gedreven juridische assistentie voor uw bedrijf.
              Contracten genereren, juridisch advies en documentanalyse - allemaal
              in één platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all"
              >
                Start Gratis Trial
              </a>
              <a 
                href="/demo" 
                className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Bekijk Demo
              </a>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <div className="relative">
              {/* Main window */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg mx-auto">
                {/* Window controls */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                {/* Chat interface */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">AI</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-gray-700">Hoe kan ik u vandaag helpen met juridisch advies?</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-blue-600 rounded-lg p-3 max-w-[80%]">
                      <p className="text-white">Ik heb hulp nodig bij het opstellen van een arbeidsovereenkomst.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -z-10 bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 w-72 h-72 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
