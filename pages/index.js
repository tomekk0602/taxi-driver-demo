'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 relative">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Vítejte v demo aplikaci Taxi VIP
      </h1>
      <p className="text-lg mb-10 text-gray-300 text-center max-w-xl">
        Vyberte si prosím typ přihlášení, který odpovídá vaší roli.
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => router.push('/admin')}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-300 border border-gray-700 hover:border-white"
        >
          Administrátor
        </button>
        <button
          onClick={() => router.push('/hotels')}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-300 border border-gray-700 hover:border-white"
        >
          Hotely
        </button>
        <button
          onClick={() => router.push('/driver')}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-300 border border-gray-700 hover:border-white"
        >
          Řidič
        </button>
      </div>

      {/* Firma - subtelny branding */}
      <div className="absolute bottom-4 text-sm text-gray-400 bg-gradient-to-r from-gray-700/30 via-gray-600/30 to-gray-700/30 px-4 py-1 rounded-full backdrop-blur-sm">
        SolutionBox Corp s.r.o.
      </div>
    </div>
  );
}

