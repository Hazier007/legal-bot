'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaHome, FaRobot, FaFileContract, FaFileAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState('ai-assistant');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const ComingSoonBadge = () => (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
    >
      Coming Soon
    </motion.div>
  );

  const ComingSoonModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={() => setShowComingSoon(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center"
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-6xl mb-4"
        >
          🚀
        </motion.div>
        <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
        <p className="text-gray-600">Deze functie is momenteel in ontwikkeling en zal binnenkort beschikbaar zijn.</p>
        <button
          onClick={() => setShowComingSoon(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sluiten
        </button>
      </motion.div>
    </motion.div>
  );

  const AIAssistantSection = () => (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">AI Vragen</h3>
              <span className="text-2xl">∞</span>
            </div>
            <p className="mt-2">Onbeperkt beschikbaar</p>
          </div>
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Contracten</h3>
              <span className="text-2xl">∞</span>
            </div>
            <p className="mt-2">Onbeperkt beschikbaar</p>
          </div>
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-xl text-white relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Documenten</h3>
              <ComingSoonBadge />
            </div>
            <p className="mt-2">AI Document Analysis</p>
          </div>
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-xl text-white relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Research</h3>
              <ComingSoonBadge />
            </div>
            <p className="mt-2">AI Legal Research</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">U:</div>
                <div className="flex-grow">
                  <p>Hoeveel dagen vooraleer ik een incasso bureau mag inschakelen?</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">AI Assistant:</div>
                <div className="flex-grow">
                  <p>Volgens de Belgische wetgeving...</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Stel een vraag..."
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Verstuur
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ContractsSection = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Contracten</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Contract Generator</h3>
          <div className="space-y-4">
            <select className="w-full p-2 border rounded-lg">
              <option>Kies contract type</option>
              <option>Arbeidsovereenkomst</option>
              <option>Huurovereenkomst</option>
              <option>NDA</option>
            </select>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Genereer Contract
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Contract Review</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">Sleep uw contract hierheen</p>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Analyseer Contract
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm relative">
          <div className="absolute top-4 right-4">
            <ComingSoonBadge />
          </div>
          <h3 className="text-lg font-semibold mb-4">Contract Management</h3>
          <p className="text-gray-500">Beheer al uw contracten op één plek</p>
        </div>
      </div>
    </div>
  );

  const DocumentsSection = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Documenten</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm relative">
          <div className="absolute top-4 right-4">
            <ComingSoonBadge />
          </div>
          <h3 className="text-lg font-semibold mb-4">Document Analyse</h3>
          <p className="text-gray-500">AI-powered document analysis</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm relative">
          <div className="absolute top-4 right-4">
            <ComingSoonBadge />
          </div>
          <h3 className="text-lg font-semibold mb-4">Document Vergelijking</h3>
          <p className="text-gray-500">Vergelijk documenten met AI</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm relative">
          <div className="absolute top-4 right-4">
            <ComingSoonBadge />
          </div>
          <h3 className="text-lg font-semibold mb-4">Document Archief</h3>
          <p className="text-gray-500">Centraal document beheer</p>
        </div>
      </div>
    </div>
  );

  const SettingsSection = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Instellingen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Account Instellingen</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="mt-1 block w-full p-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Abonnement</label>
              <input
                type="text"
                value="Enterprise"
                disabled
                className="mt-1 block w-full p-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm relative">
          <div className="absolute top-4 right-4">
            <ComingSoonBadge />
          </div>
          <h3 className="text-lg font-semibold mb-4">API Integratie</h3>
          <p className="text-gray-500">Integreer CollectLegal met uw systemen</p>
        </div>
      </div>
    </div>
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Toegang geweigerd</h1>
          <p className="mt-2 text-gray-600">Log in om toegang te krijgen tot het dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showComingSoon && <ComingSoonModal />}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">CollectLegal.be</span>
            </div>
            <div>
              <span className="text-gray-600">
                Welkom terug, {session.user?.email}
              </span>
              <div className="text-sm text-gray-500">Enterprise Account</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 bg-white shadow-sm">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'dashboard'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FaHome className="mr-3 h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveSection('ai-assistant')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'ai-assistant'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FaRobot className="mr-3 h-5 w-5" />
                AI Assistant
              </button>
              <button
                onClick={() => setActiveSection('contracts')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'contracts'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FaFileContract className="mr-3 h-5 w-5" />
                Contracten
              </button>
              <button
                onClick={() => setActiveSection('documents')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'documents'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FaFileAlt className="mr-3 h-5 w-5" />
                Documenten
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'settings'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FaCog className="mr-3 h-5 w-5" />
                Instellingen
              </button>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-2 mb-2 text-xs font-semibold text-gray-600 uppercase">
                  Extra Diensten
                </div>
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FaRobot className="mr-3 h-5 w-5" />
                  AI Juridische Research
                </button>
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FaRobot className="mr-3 h-5 w-5" />
                  AI Compliance Checker
                </button>
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FaRobot className="mr-3 h-5 w-5" />
                  AI Juridische Vertaling
                </button>
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FaRobot className="mr-3 h-5 w-5" />
                  AI Juridische Samenvatting
                </button>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-3 h-5 w-5" />
                  Uitloggen
                </button>
              </div>
            </div>
          </nav>
        </div>

        <main className="flex-1 overflow-y-auto">
          {activeSection === 'dashboard' && <AIAssistantSection />}
          {activeSection === 'ai-assistant' && <AIAssistantSection />}
          {activeSection === 'contracts' && <ContractsSection />}
          {activeSection === 'documents' && <DocumentsSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
