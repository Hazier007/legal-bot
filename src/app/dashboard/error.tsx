'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Er is iets misgegaan!</h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'Er is een onverwachte fout opgetreden in het dashboard.'}
          </p>
          <button
            onClick={reset}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    </div>
  );
}
