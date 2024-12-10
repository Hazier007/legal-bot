'use client'

import { FaRobot, FaFileContract, FaSearchPlus, FaClipboardCheck, FaLanguage, FaFileAlt } from 'react-icons/fa'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const features = [
  {
    icon: <FaRobot className="w-6 h-6" />,
    title: "AI Legal Bot",
    description: "24/7 beschikbare AI-assistent voor al uw juridische vragen en documentatie behoeften."
  },
  {
    icon: <FaFileContract className="w-6 h-6" />,
    title: "Contract Generator",
    description: "Genereer professionele contracten op maat met onze geavanceerde AI-technologie."
  },
  {
    icon: <FaSearchPlus className="w-6 h-6" />,
    title: "AI Juridische Research Assistent",
    description: "Doorzoek en analyseer juridische bronnen en jurisprudentie met AI-aangedreven inzichten."
  },
  {
    icon: <FaClipboardCheck className="w-6 h-6" />,
    title: "AI Compliance Checker",
    description: "Controleer automatisch of uw documenten voldoen aan de laatste wet- en regelgeving."
  },
  {
    icon: <FaLanguage className="w-6 h-6" />,
    title: "AI Juridische Vertaalservice",
    description: "Vertaal juridische documenten nauwkeurig naar verschillende talen met behoud van juridische context."
  },
  {
    icon: <FaFileAlt className="w-6 h-6" />,
    title: "AI Juridische Samenvatting",
    description: "Krijg heldere samenvattingen van complexe juridische documenten en rapporten."
  }
]

export default function Features() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  }

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Onze Services</h2>
            <p className="text-xl text-gray-600">Ontdek hoe onze AI-powered oplossingen uw juridische werk kunnen optimaliseren</p>
          </div>
          
          <Slider {...settings} className="features-slider">
            {features.map((feature, index) => (
              <div key={index} className="px-4">
                <div className="relative group bg-white p-8 rounded-2xl transition-all duration-300 hover:shadow-xl border border-gray-100 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  <div className="text-blue-600 mb-4 bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}
