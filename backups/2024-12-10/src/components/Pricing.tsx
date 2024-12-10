import { FaCheck } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Sophie Dubois',
    role: 'CEO TechStart BVBA',
    quote: 'CollectLegal heeft ons enorm geholpen met het stroomlijnen van onze juridische processen. De AI-assistent is verbazingwekkend accuraat.'
  },
  {
    name: 'Marc Janssens',
    role: 'Juridisch Adviseur',
    quote: 'Als juridisch adviseur waardeer ik de precisie en snelheid waarmee CollectLegal contracten genereert. Een onmisbaar hulpmiddel.'
  },
  {
    name: 'Lisa Peeters',
    role: 'HR Manager BuildCo NV',
    quote: 'De arbeidsovereenkomsten die we via CollectLegal genereren zijn perfect op maat en volledig conform de Belgische wetgeving.'
  }
]

const plans = [
  {
    name: "Starter",
    price: "199",
    period: "per maand",
    description: "Perfect voor kleine bedrijven en startups",
    features: [
      "Onbeperkte AI juridische vragen",
      "5 contract generaties per maand",
      "Basis document analyse",
      "Email support",
      "Nederlandse & Franse taal"
    ],
    highlighted: false,
    buttonText: "Start Gratis Trial"
  },
  {
    name: "Professional",
    price: "499",
    period: "per maand",
    description: "Voor groeiende bedrijven met meer behoeften",
    features: [
      "Alles in Starter",
      "20 contract generaties per maand",
      "Geavanceerde document analyse",
      "Prioriteit support",
      "Alle EU talen"
    ],
    highlighted: true,
    buttonText: "Start Gratis Trial"
  },
  {
    name: "Enterprise",
    price: "999",
    period: "per maand",
    description: "Voor grote organisaties met specifieke eisen",
    features: [
      "Onbeperkte contract generaties",
      "Custom AI training",
      "API toegang",
      "24/7 dedicated support",
      "White label optie"
    ],
    highlighted: false,
    buttonText: "Contacteer Ons"
  }
]

export default function Pricing() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Eenvoudige, transparante prijzen</h2>
          <p className="text-xl text-gray-600">Kies het plan dat het beste bij uw bedrijf past</p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative ${
                  plan.highlighted
                    ? 'bg-white border-2 border-blue-500 shadow-xl scale-105'
                    : 'bg-white border border-gray-200'
                } rounded-2xl p-8 transition-all duration-300 hover:shadow-xl`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Meest Populair
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-bold">€{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <FaCheck className="text-green-500 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Wat onze klanten zeggen</h2>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
