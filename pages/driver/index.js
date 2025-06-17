import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, MessageSquare, DollarSign, Clock, Calendar, Power, CheckCircle, XCircle, AlertCircle, User, Star, TrendingUp, Home, History, Camera, FileText, Settings, Bell, Users, Car, Plane, Undo } from 'lucide-react';

const TaxiDriverApp = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [hasActiveRide, setHasActiveRide] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [rideStatus, setRideStatus] = useState('waiting');
  const [todayEarnings, setTodayEarnings] = useState(2840);
  const [todayRides, setTodayRides] = useState(7);
  const [isRegistered, setIsRegistered] = useState(true);
  const [workingHours, setWorkingHours] = useState({ enabled: true, from: '08:00', to: '20:00' });
  const [showMapModal, setShowMapModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 6;
  });
  const [isMapPanelMinimized, setIsMapPanelMinimized] = useState(false);
  const [driverProfile, setDriverProfile] = useState({
    name: 'Jan Novák',
    phone: '+420 777 123 456',
    spz: '3A7 1234',
    carColor: 'Černá',
    carModel: 'Mercedes S-Class',
    carYear: '2024',
    carType: 'standard',
    photo: null
  });

  // Catch Transfer inspired theme
  const theme = {
    light: {
      bg: 'bg-white',
      cardBg: 'bg-gray-50',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      border: 'border-gray-100',
      borderStrong: 'border-gray-200',
      shadow: 'shadow-sm',
      shadowHover: 'shadow-md',
      statusBar: 'bg-gray-900',
      navBg: 'bg-white',
      navBorder: 'border-gray-100',
      inputBg: 'bg-white',
      primary: 'bg-teal-400',
      primaryHover: 'hover:bg-teal-500',
      primaryText: 'text-teal-600',
      success: 'text-teal-600',
      warning: 'text-amber-500',
      danger: 'text-red-500'
    },
    dark: {
      bg: 'bg-gray-900',
      cardBg: 'bg-gray-800',
      textPrimary: 'text-gray-100',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      borderStrong: 'border-gray-600',
      shadow: 'shadow-lg shadow-black/20',
      shadowHover: 'shadow-xl shadow-black/30',
      statusBar: 'bg-black',
      navBg: 'bg-gray-800',
      navBorder: 'border-gray-700',
      inputBg: 'bg-gray-700',
      primary: 'bg-teal-500',
      primaryHover: 'hover:bg-teal-600',
      primaryText: 'text-teal-400',
      success: 'text-teal-400',
      warning: 'text-amber-400',
      danger: 'text-red-400'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  // Simulace nové objednávky
  useEffect(() => {
    if (isOnline && !hasActiveRide && !showNewRequest) {
      const timer = setTimeout(() => {
        setShowNewRequest(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasActiveRide, showNewRequest]);

  const acceptRide = () => {
    setShowNewRequest(false);
    setHasActiveRide(true);
    setRideStatus('waiting');
    setShowMapModal(true);
  };

  const rejectRide = () => {
    setShowNewRequest(false);
  };

  const updateRideStatus = () => {
    if (rideStatus === 'waiting') {
      setRideStatus('picked_up');
    } else if (rideStatus === 'picked_up') {
      setRideStatus('in_progress');
    } else {
      setHasActiveRide(false);
      setRideStatus('waiting');
      setTodayEarnings(todayEarnings + 900);
      setTodayRides(todayRides + 1);
      setCurrentScreen('home');
    }
  };

  // Hlavní obrazovka
  const HomeScreen = () => (
    <div className={`flex-1 flex flex-col ${currentTheme.bg} pb-16 overflow-hidden`}>
      {/* Status bar s gradientem - kompaktní */}
      <button
        onClick={() => setIsOnline(!isOnline)}
        className={`relative w-full overflow-hidden transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] ${
          isOnline 
            ? 'bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600' 
            : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
        }`}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {!isOnline && (
          <>
            <div className="absolute top-1 left-6 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-4 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-6 left-12 w-0.5 h-0.5 bg-blue-200 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-3 right-12 w-1 h-1 bg-indigo-200 rounded-full opacity-50"></div>
          </>
        )}
        <div className="relative p-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </h2>
              <p className="text-xs opacity-90 mt-1">
                {isOnline ? 'Čekání na objednávky...' : 'Stiskněte pro začátek'}
              </p>
              {isOnline && !hasActiveRide && (
                <p className="text-xs text-teal-100 mt-2 animate-pulse">
                  Demo: objednávka přijde za 3 sekundy
                </p>
              )}
            </div>
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                transform transition-all duration-300 hover:scale-110 active:scale-95
                ${isOnline 
                  ? 'bg-white text-teal-500 shadow-lg drop-shadow-lg' 
                  : 'bg-white bg-opacity-90 text-slate-700 shadow-lg hover:shadow-xl drop-shadow-lg'
                }
              `}
            >
              <Power size={28} strokeWidth={3} className="drop-shadow-sm" />
            </div>
          </div>
        </div>
        {isOnline && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        )}
        {!isOnline && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="h-full bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-20 animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Dnešní statistiky - kompaktní */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${currentTheme.textSecondary} text-xs font-semibold`}>Dnešní přehled</h3>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              title={darkMode ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative group">
              <div 
                className={`${currentTheme.cardBg} p-4 rounded-2xl transition-all duration-300 border border-gray-100`}
                style={{
                  boxShadow: darkMode 
                    ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="text-center">
                  <div className={`p-3 bg-teal-100 rounded-xl mx-auto w-fit mb-3`}>
                    <DollarSign className="text-teal-600 drop-shadow-sm" size={24} strokeWidth={2.8} />
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-1">
                    {todayEarnings.toLocaleString()} 
                  </p>
                  <p className={`text-xs ${currentTheme.textSecondary} uppercase tracking-wide`}>Výdělek</p>
                  <p className={`text-xs ${currentTheme.textMuted}`}>Kč</p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div 
                className={`${currentTheme.cardBg} p-4 rounded-2xl transition-all duration-300 border border-gray-100`}
                style={{
                  boxShadow: darkMode 
                    ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="text-center">
                  <div className={`p-3 bg-purple-100 rounded-xl mx-auto w-fit mb-3`}>
                    <TrendingUp className="text-purple-600 drop-shadow-sm" size={24} strokeWidth={2.8} />
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-1">
                    {todayRides}
                  </p>
                  <p className={`text-xs ${currentTheme.textSecondary} uppercase tracking-wide`}>Jízdy</p>
                  <p className={`text-xs ${currentTheme.textMuted}`}>počet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

              {/* Seznam dostupných objednávek nebo poslední aktivity */}
        <div className="flex-1 px-4 pb-4">
          {isOnline ? (
            <div>
              <h3 className={`${currentTheme.textSecondary} text-xs font-semibold mb-3`}>Dostupné objednávky</h3>
              <div 
                className={`${currentTheme.cardBg} rounded-2xl p-6 text-center`}
                style={{
                  boxShadow: darkMode 
                    ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className={`p-4 bg-gradient-to-br ${darkMode ? 'from-gray-700 to-gray-800' : 'from-gray-100 to-gray-200'} rounded-2xl mb-4 w-fit mx-auto`}>
                  <Clock size={36} strokeWidth={2.5} className={`${currentTheme.textMuted} drop-shadow-sm`} />
                </div>
                <p className={`${currentTheme.textPrimary} font-semibold mb-2 text-base`}>Čekání na objednávky</p>
                <p className={`text-xs ${currentTheme.textMuted}`}>Nové objednávky se zobrazí automaticky</p>
                {!hasActiveRide && (
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping absolute"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-teal-600 font-medium">Online a připraven</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className={`mt-4 bg-gradient-to-r ${darkMode ? 'from-teal-900 to-teal-800' : 'from-teal-50 to-teal-100'} rounded-xl p-4 border ${darkMode ? 'border-teal-800' : 'border-teal-100'}`}>
                <p className={`text-xs ${darkMode ? 'text-teal-300' : 'text-teal-800'} font-medium text-center`}>
                  Začněte vydělávat! Přepněte se do režimu ONLINE
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rychlé akce - kompaktní */}
      <div className={`p-3 ${currentTheme.cardBg} border-t ${currentTheme.border}`}>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Clock, label: 'Přestávka' },
            { icon: Phone, label: 'Podpora' },
            { icon: MessageSquare, label: 'Chat' }
          ].map((item, index) => (
            <button
              key={index}
              className={`group p-3 text-center rounded-xl hover:bg-gradient-to-br ${darkMode ? 'hover:from-gray-700 hover:to-gray-800' : 'hover:from-gray-50 hover:to-gray-100'} transition-all duration-300`}
            >
              <div className={`p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl mx-auto w-fit group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`${currentTheme.textSecondary} drop-shadow-sm`} size={18} strokeWidth={2.5} />
              </div>
              <span className={`text-xs ${currentTheme.textPrimary} mt-2 block font-medium`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Modal z mapou na cały ekran
  const renderMapModal = () => {
    if (!showMapModal) return null;
    
    const getMapImage = () => {
      const theme = darkMode ? 'dark' : 'light';
      const status = rideStatus;
      
      const maps = {
        light: {
          waiting: './maps/a1.png',
          picked_up: './maps/a2.png',
          in_progress: './maps/a3.png',
        },
        dark: {
          waiting: './maps/a1.jpg',
          picked_up: './maps/a2.jpg',
          in_progress: './maps/a3.jpg',
        }
      };
      
      return maps[theme][status] || maps[theme].waiting;
    };

    const closeMapModal = () => {
      setShowMapModal(false);
      setIsMapPanelMinimized(false); // Reset minimalizacji
      setCurrentScreen('active-ride');
    };

    const updateRideStatusInModal = () => {
      if (rideStatus === 'waiting') {
        setRideStatus('picked_up');
      } else if (rideStatus === 'picked_up') {
        setRideStatus('in_progress');
      } else {
        setHasActiveRide(false);
        setRideStatus('waiting');
        setTodayEarnings(todayEarnings + 900);
        setTodayRides(todayRides + 1);
        setShowMapModal(false);
        setCurrentScreen('home');
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={getMapImage()}
            alt="GPS Mapa"
            className="w-full h-full object-cover"
          />
          
          <div className={`absolute top-6 left-6 ${currentTheme.cardBg} rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 ${
            isMapPanelMinimized ? 'p-4 max-w-xs' : 'p-6 max-w-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${currentTheme.textPrimary} ${isMapPanelMinimized ? 'text-lg' : 'text-xl'}`}>
                {isMapPanelMinimized ? 'Jízda' : 'Aktivní jízda'}
              </h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsMapPanelMinimized(!isMapPanelMinimized)}
                  className={`p-2 hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-2xl transition-colors`}
                  title={isMapPanelMinimized ? 'Rozbalit panel' : 'Skrýt panel'}
                >
                  {isMapPanelMinimized ? (
                    <div className="w-4 h-4 flex flex-col space-y-0.5">
                      <div className={`h-0.5 w-full ${currentTheme.textMuted} bg-current rounded`}></div>
                      <div className={`h-0.5 w-full ${currentTheme.textMuted} bg-current rounded`}></div>
                      <div className={`h-0.5 w-full ${currentTheme.textMuted} bg-current rounded`}></div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className={`w-3 h-0.5 ${currentTheme.textMuted} bg-current rounded`}></div>
                    </div>
                  )}
                </button>
                <button 
                  onClick={closeMapModal}
                  className={`p-2 hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-2xl transition-colors`}
                >
                  <XCircle size={20} className={`${currentTheme.textMuted}`} />
                </button>
              </div>
            </div>
            
            {!isMapPanelMinimized ? (
              /* Rozbalený panel - pełne informacje */
              <>
                {/* Route with animated dots */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <div className={`w-4 h-4 rounded-full ${
                        rideStatus !== 'waiting' ? 'bg-teal-500' : 'bg-gray-300'
                      } transition-colors duration-300`}></div>
                      {rideStatus !== 'waiting' && (
                        <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-75"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${currentTheme.textPrimary}`}>Hotel Augustine</p>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Výchozí bod</p>
                    </div>
                  </div>
                  
                  {/* Animated connecting line */}
                  <div className="ml-2 flex items-center">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-teal-400 to-red-400 mr-4 relative overflow-hidden">
                      <div className="absolute inset-0 w-full bg-gradient-to-b from-white to-transparent opacity-50 animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <p className={`text-xs ${currentTheme.textMuted}`}>18.2 km • 25 min</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <div className={`w-4 h-4 rounded-full ${
                        rideStatus === 'in_progress' ? 'bg-red-500' : 'bg-gray-300'
                      } transition-colors duration-300`}></div>
                      {rideStatus === 'in_progress' && (
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${currentTheme.textPrimary}`}>Letiště Václava Havla</p>
                      <p className={`text-xs ${currentTheme.textMuted}`}>Cílové místo</p>
                    </div>
                  </div>
                </div>
                
                {/* Status with animated background */}
                <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl relative overflow-hidden`}>
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                  <div className="relative">
                    <p className={`text-xs ${currentTheme.textMuted} mb-2 uppercase tracking-wide`}>Status:</p>
                    <p className={`font-bold ${currentTheme.textPrimary} text-lg`}>
                      {rideStatus === 'waiting' && (
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                          Jeďte k místu vyzvednutí
                        </span>
                      )}
                      {rideStatus === 'picked_up' && (
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Cestující na palubě
                        </span>
                      )}
                      {rideStatus === 'in_progress' && (
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                          Na cestě k cíli
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Minimalizowany panel - základní informace */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      rideStatus === 'waiting' ? 'bg-blue-500 animate-pulse' :
                      rideStatus === 'picked_up' ? 'bg-green-500 animate-pulse' :
                      'bg-red-500 animate-pulse'
                    }`}></div>
                    <span className={`text-sm font-semibold ${currentTheme.textPrimary}`}>
                      {rideStatus === 'waiting' && 'K vyzvednutí'}
                      {rideStatus === 'picked_up' && 'Na palubě'}
                      {rideStatus === 'in_progress' && 'K cíli'}
                    </span>
                  </div>
                  <span className={`text-xs ${currentTheme.textMuted}`}>700 Kč</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className={`text-xs ${currentTheme.textMuted}`}>
                    {rideStatus === 'waiting' && 'Augustine → Letiště'}
                    {rideStatus === 'picked_up' && 'Augustine → Letiště'}
                    {rideStatus === 'in_progress' && '18.2 km • 22 min'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Animated earnings card */}
          <div className={`absolute top-6 right-6 ${currentTheme.cardBg} rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden`}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-green-500/5 animate-pulse"></div>
            <div className="relative text-center">
              <p className={`text-sm ${currentTheme.textMuted} mb-2 uppercase tracking-wide`}>Váš příjem</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">700</p>
                <div className="flex flex-col">
                  <p className={`text-lg font-semibold ${currentTheme.textPrimary}`}>Kč</p>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-teal-500 to-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
            {/* Status text */}
            <div className={`${currentTheme.cardBg} px-6 py-3 rounded-full shadow-lg border border-gray-100`}>
              <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-lg`}>
                {
                    rideStatus === 'waiting' ? 'Jsem na místě' :
                    rideStatus === 'picked_up' ? 'Zahájit jízdu' :
                    'Ukončit jízdu'
                  }
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4">
              {/* Main action button */}
              <button
                onClick={updateRideStatusInModal}
                className={`w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                  rideStatus === 'waiting' ? 'bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700' :
                  rideStatus === 'picked_up' ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                  'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                }`}
              >
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-30 animate-ping"></div>
                {rideStatus === 'waiting' && <MapPin className="text-white drop-shadow-sm" size={30} strokeWidth={2.8} />}
                {rideStatus === 'picked_up' && <Navigation className="text-white drop-shadow-sm" size={30} strokeWidth={2.8} />}
                {rideStatus === 'in_progress' && <CheckCircle className="text-white drop-shadow-sm" size={30} strokeWidth={2.8} />}
              </button>

              {/* Navigation button */}
              <button 
                onClick={closeMapModal} 
                className="w-16 h-16 p-0 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
              >
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-30 animate-pulse"></div>
                <Undo size={30} strokeWidth={2.8} className="drop-shadow-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Obrazovka nové objednávky
  const NewRequestScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className={`${currentTheme.cardBg} rounded-3xl overflow-hidden shadow-2xl animate-slideUp w-full max-w-md max-h-[90vh] flex flex-col`}>
        <div className="relative bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
          <div className="absolute inset-0 bg-white opacity-10"></div>
          <div className="relative text-center">
            <h2 className="text-2xl font-bold">NOVÁ OBJEDNÁVKA</h2>
            <p className="text-teal-100 mt-2">Prioritní nabídka</p>
          </div>
        </div>

        <div className={`bg-gradient-to-r ${darkMode ? 'from-teal-900 to-teal-800' : 'from-teal-50 to-teal-100'} px-6 py-4 border-b ${darkMode ? 'border-teal-800' : 'border-teal-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 ${currentTheme.cardBg} rounded-2xl mr-4 ${currentTheme.shadow}`}>
                <Users className="text-teal-600" size={20} />
              </div>
              <span className={`font-bold ${currentTheme.textPrimary}`}>Hotel Augustine</span>
            </div>
            <span className={`px-3 py-2 ${currentTheme.cardBg} rounded-full text-sm font-bold text-teal-600 ${currentTheme.shadow}`}>AUG</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-2xl mr-4">
                  <MapPin size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${currentTheme.textPrimary}`}>Hotel Augustine</p>
                  <p className={`text-sm ${currentTheme.textSecondary}`}>Letenská 12/33, Praha 1</p>
                </div>
              </div>
              
              <div className="ml-14 mb-4">
                <div className="flex items-center">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-green-400 to-red-400 mr-4"></div>
                  <p className={`text-sm ${currentTheme.textMuted}`}>18.2 km • ~25 min</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-2xl mr-4">
                  <Plane size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${currentTheme.textPrimary}`}>Letiště Václava Havla</p>
                  <p className={`text-sm ${currentTheme.textSecondary}`}>Terminál 2, Odlety</p>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${darkMode ? 'from-gray-700 to-gray-800' : 'from-gray-50 to-gray-100'} p-5 rounded-2xl mb-6 border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${currentTheme.textPrimary} mb-1`}>900</p>
                  <p className={`text-xs ${currentTheme.textSecondary} uppercase tracking-wide`}>Celková cena</p>
                  <p className={`text-xs ${currentTheme.textMuted}`}>Kč</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-1">700</p>
                  <p className={`text-xs ${currentTheme.textSecondary} uppercase tracking-wide`}>Váš příjem</p>
                  <p className={`text-xs ${currentTheme.textMuted}`}>Kč</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${currentTheme.textPrimary} mb-1`}>25</p>
                  <p className={`text-xs ${currentTheme.textSecondary} uppercase tracking-wide`}>Čas jízdy</p>
                  <p className={`text-xs ${currentTheme.textMuted}`}>min</p>
                </div>
              </div>
              <div className="text-center">
                <p className={`text-xs ${currentTheme.textMuted}`}>po odečtení provize</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: User, text: 'Recepce • Pokoj: 237' },
                { icon: Clock, text: 'Okamžitě' },
                { icon: FileText, text: 'Přepravní smlouva bude vygenerována' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center ${currentTheme.textSecondary} text-sm`}>
                  <item.icon size={16} className={`mr-3 ${currentTheme.textMuted}`} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom buttons */}
        <div className={`flex p-4 space-x-3 bg-gradient-to-t ${darkMode ? 'from-gray-800 to-gray-700' : 'from-gray-100 to-gray-50'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={rejectRide}
            className="flex-1 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <XCircle className="mr-2" size={20} />
            Odmítnout
          </button>
          <button
            onClick={acceptRide}
            className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <CheckCircle className="mr-2" size={20} />
            Přijmout
          </button>
        </div>
      </div>
    </div>
  );

  // Obrazovka aktivní jízdy
  const ActiveRideScreen = () => (
    <div className={`flex-1 flex flex-col ${currentTheme.bg} pb-16 overflow-y-auto`}>
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Aktivní jízda</h2>
            <p className="text-teal-100 mt-2">
              {rideStatus === 'waiting' && 'Jeďte k místu vyzvednutí'}
              {rideStatus === 'picked_up' && 'Cestující na palubě'}
              {rideStatus === 'in_progress' && 'Na cestě k cíli'}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white text-teal-600 px-6 py-3 rounded-full font-bold shadow-lg text-xl">
              700 Kč
            </div>
            <p className="text-xs mt-2 text-teal-100">váš příjem</p>
          </div>
        </div>
      </div>

      <div className={`bg-gradient-to-r ${darkMode ? 'from-teal-900 to-teal-800' : 'from-teal-50 to-teal-100'} px-6 py-4 flex justify-between items-center border-b ${darkMode ? 'border-teal-800' : 'border-teal-100'}`}>
        <span className={`font-bold ${currentTheme.textPrimary} text-lg`}>Hotel Augustine</span>
        <span className={`text-sm ${currentTheme.textSecondary} ${currentTheme.cardBg} px-4 py-2 rounded-full`}>Objednávka #2847</span>
      </div>

      <div className={`${currentTheme.cardBg} m-6 rounded-3xl ${currentTheme.shadow} p-6`}>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="relative mr-4">
              <div className={`w-6 h-6 rounded-full ${
                rideStatus !== 'waiting' ? 'bg-teal-500' : 'bg-gray-300'
              } transition-colors duration-300`}></div>
              {rideStatus !== 'waiting' && (
                <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-bold ${currentTheme.textPrimary} text-lg`}>Hotel Augustine</p>
              <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>Letenská 12/33, Praha 1</p>
              {rideStatus === 'waiting' && (
                <div className={`mt-3 ${darkMode ? 'bg-teal-900' : 'bg-teal-50'} px-4 py-2 rounded-2xl inline-block`}>
                  <p className={`text-xs ${darkMode ? 'text-teal-300' : 'text-teal-600'} font-semibold`}>← Jeďte sem (3.5 km • 8 min)</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="relative mr-4">
              <div className={`w-6 h-6 rounded-full ${
                rideStatus === 'in_progress' ? 'bg-teal-500' : 'bg-gray-300'
              } transition-colors duration-300`}></div>
              {rideStatus === 'in_progress' && (
                <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-bold ${currentTheme.textPrimary} text-lg`}>Letiště Václava Havla</p>
              <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>Terminál 2, Odlety</p>
              {rideStatus === 'in_progress' && (
                <div className={`mt-3 ${darkMode ? 'bg-teal-900' : 'bg-teal-50'} px-4 py-2 rounded-2xl inline-block`}>
                  <p className={`text-xs ${darkMode ? 'text-teal-300' : 'text-teal-600'} font-semibold`}>← Cíl cesty (18.2 km • 22 min)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-6 pt-6 border-t ${currentTheme.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl mr-4`}>
                <User className={`${currentTheme.textSecondary}`} size={24} />
              </div>
              <div>
                <p className={`font-bold ${currentTheme.textPrimary} text-lg`}>Recepce Augustine</p>
                <p className={`text-sm ${currentTheme.textSecondary}`}>Pokoj 237</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className={`p-4 bg-gradient-to-br ${darkMode ? 'from-green-800 to-green-900 text-green-300' : 'from-green-100 to-green-200 text-green-700'} rounded-2xl hover:${currentTheme.shadowHover} transition-all duration-300`}>
                <Phone size={24} />
              </button>
              <button className={`p-4 bg-gradient-to-br ${darkMode ? 'from-teal-800 to-teal-900 text-teal-300' : 'from-teal-100 to-teal-200 text-teal-700'} rounded-2xl hover:${currentTheme.shadowHover} transition-all duration-300`}>
                <Navigation size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 bg-gradient-to-br ${darkMode ? 'from-gray-800 to-gray-900' : 'from-gray-100 to-gray-200'} relative mx-6 mb-6 rounded-3xl overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`p-6 ${currentTheme.cardBg} rounded-3xl ${currentTheme.shadowHover} mb-6`}>
              <Navigation size={58} strokeWidth={2.5} className="text-teal-600 mx-auto drop-shadow-sm" />
            </div>
            <p className={`${currentTheme.textPrimary} font-bold mb-6 text-lg`}>GPS Navigace</p>
            <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl font-semibold flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Navigation className="mr-3 drop-shadow-sm" size={26} strokeWidth={2.5} />
              Otevřít v Google Maps
            </button>
            <p className={`text-sm ${currentTheme.textSecondary} mt-6 font-medium`}>
              {rideStatus === 'waiting' && 'Do hotelu: 3.5 km • 8 min'}
              {rideStatus === 'picked_up' && 'Čekání na start'}
              {rideStatus === 'in_progress' && 'Na letiště: 18.2 km • 22 min'}
            </p>
          </div>
        </div>
      </div>

      <div className={`p-6 ${currentTheme.cardBg} border-t ${currentTheme.border}`}>
        <button
          onClick={updateRideStatus}
          className={`w-full py-5 rounded-3xl font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg ${
            rideStatus === 'waiting' ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700' :
            rideStatus === 'picked_up' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
            'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          }`}
        >
          {rideStatus === 'waiting' && 'Jsem na místě'}
          {rideStatus === 'picked_up' && 'Zahájit jízdu'}
          {rideStatus === 'in_progress' && 'Ukončit jízdu'}
        </button>
        
        <button
          onClick={() => setShowMapModal(true)}
          className={`w-full mt-4 py-4 ${currentTheme.cardBg} border-2 border-teal-500 text-teal-500 rounded-3xl font-semibold hover:bg-teal-50 ${darkMode ? 'hover:bg-teal-900' : 'hover:bg-teal-50'} transition-all duration-300`}
        >
          📍 Zobrazit mapu na celé obrazovce
        </button>
      </div>
    </div>
  );

  // Historie
  const HistoryScreen = () => (
    <div className={`flex-1 ${currentTheme.bg} pb-16 overflow-y-auto`}>
      <div className={`${currentTheme.cardBg} p-6 ${currentTheme.shadow}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>Historie jízd</h2>
            <p className={`text-sm ${currentTheme.textSecondary} mt-2`}>Celkem jízd: 127</p>
          </div>
          <select className={`px-5 py-3 border ${currentTheme.borderStrong} rounded-2xl text-sm ${currentTheme.inputBg} ${currentTheme.textPrimary} font-medium`}>
            <option>Tento týden</option>
            <option>Tento měsíc</option>
            <option>Vše</option>
          </select>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {[
          { 
            time: '14:32', 
            date: 'Dnes',
            hotel: 'Four Seasons',
            from: 'Hotel Four Seasons', 
            to: 'Hlavní nádraží', 
            price: 280,
            commission: 200,
            rating: 5,
            invoiced: false 
          },
          { 
            time: '12:15',
            date: 'Dnes', 
            hotel: 'Augustine',
            from: 'Hotel Augustine', 
            to: 'Letiště Václava Havla', 
            price: 700,
            commission: 900,
            rating: 5,
            invoiced: true 
          },
          { 
            time: '10:45',
            date: 'Včera',
            hotel: 'Hilton',
            from: 'Hotel Hilton Prague', 
            to: 'Václavské náměstí', 
            price: 150,
            commission: 180,
            rating: 4,
            invoiced: false 
          },
        ].map((ride, index) => (
          <div key={index} className={`${currentTheme.cardBg} p-6 rounded-3xl ${currentTheme.shadow} hover:${currentTheme.shadowHover} transition-all duration-300`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className={`text-xs bg-gradient-to-r ${darkMode ? 'from-teal-800 to-teal-900 text-teal-300' : 'from-teal-100 to-teal-200 text-teal-700'} px-4 py-2 rounded-full font-semibold`}>{ride.hotel}</span>
                  {ride.invoiced && (
                    <span className={`text-xs bg-gradient-to-r ${darkMode ? 'from-green-800 to-green-900 text-green-300' : 'from-green-100 to-green-200 text-green-700'} px-4 py-2 rounded-full ml-3 font-semibold`}>Faktura</span>
                  )}
                </div>
                <p className={`font-bold ${currentTheme.textPrimary} text-lg`}>{ride.from}</p>
                <p className={`text-sm ${currentTheme.textSecondary} mt-2`}>→ {ride.to}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">{ride.price} Kč</p>
                <p className={`text-xs ${currentTheme.textMuted}`}>z {ride.commission} Kč</p>
                <p className={`text-xs ${currentTheme.textMuted} mt-2`}>{ride.date} • {ride.time}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < ride.rating ? 'text-yellow-400 fill-current' : `${darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className={`text-sm ${currentTheme.textSecondary} ml-3 font-medium`}>({ride.rating}.0)</span>
              </div>
              <button className={`text-teal-600 text-sm flex items-center font-semibold hover:text-teal-700 transition-colors`}>
                <FileText size={18} className="mr-2" />
                Smlouva
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6">
        <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-3xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
          Zobrazit celou historii
        </button>
      </div>
    </div>
  );

  // Profil řidiče
  const ProfileScreen = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState({...driverProfile});
    const [showPhoneVerification, setShowPhoneVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(true);

    const handleSave = () => {
      setDriverProfile(tempProfile);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setTempProfile({...driverProfile});
      setIsEditing(false);
    };

    const handlePhotoUpload = () => {
      setTempProfile({...tempProfile, photo: 'uploaded_photo.jpg'});
    };

    const verifyPhone = () => {
      if (verificationCode === '1234') {
        setIsVerified(true);
        setShowPhoneVerification(false);
        setVerificationCode('');
      }
    };

    return (
      <div className={`flex-1 ${currentTheme.bg} pb-16 overflow-y-auto`}>
        <div className={`${currentTheme.cardBg} p-6 ${currentTheme.shadow}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>Profil řidiče</h2>
              <p className={`text-sm ${currentTheme.textSecondary} mt-2`}>
                {isEditing ? 'Editace údajů' : 'Vaše údaje'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isVerified ? (
                <div className="flex items-center bg-teal-100 px-4 py-2 rounded-full">
                  <CheckCircle size={18} className="text-teal-600 mr-2" />
                  <span className="text-xs text-teal-700 font-semibold">Ověřen</span>
                </div>
              ) : (
                <div className="flex items-center bg-red-100 px-4 py-2 rounded-full">
                  <AlertCircle size={18} className="text-red-600 mr-2" />
                  <span className="text-xs text-red-700 font-semibold">Neověřen</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
            <h3 className={`font-bold ${currentTheme.textPrimary} mb-3 text-lg`}>Osobní údaje</h3>
            <div className="space-y-6">
              <div>
                <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>Jméno a příjmení</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                    className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary} text-lg`}
                    placeholder="Zadejte jméno a příjmení"
                  />
                ) : (
                  <p className={`${currentTheme.textPrimary} font-semibold mt-2 text-lg`}>{driverProfile.name}</p>
                )}
              </div>

              <div>
                <label className={`text-sm ${currentTheme.textSecondary} font-medium flex items-center`}>
                  Telefon
                  {!isVerified && (
                    <button
                      onClick={() => setShowPhoneVerification(true)}
                      className="ml-3 text-teal-600 text-xs underline"
                    >
                      Ověřit
                    </button>
                  )}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                    className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary} text-lg`}
                    placeholder="+420 777 123 456"
                  />
                ) : (
                  <p className={`${currentTheme.textPrimary} font-semibold mt-2 text-lg`}>{driverProfile.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
            <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-lg`}>Údaje o vozidle</h3>
            
            {/* Zdjęcie samochodu */}
            <div className="mb-6">
              <label className={`text-sm ${currentTheme.textSecondary} font-medium block mb-3`}>Fotka vozidla</label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-20 bg-gray-200 rounded-2xl overflow-hidden border-2 border-gray-100">
                  <img 
                    src="/mercedes-s-class.jpg" 
                    alt={tempProfile.carModel}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={`w-full h-full bg-gradient-to-br ${darkMode ? 'from-gray-700 to-gray-800' : 'from-gray-100 to-gray-200'} items-center justify-center hidden`}>
                    <Car className={`${currentTheme.textMuted} drop-shadow-sm`} size={34} strokeWidth={2.5} />
                  </div>
                </div>
                {isEditing && (
                  <div>
                    <button
                      onClick={handlePhotoUpload}
                      className="px-6 py-3 bg-teal-500 text-white rounded-2xl text-sm font-semibold hover:bg-teal-600 transition-colors"
                    >
                      Změnit fotku
                    </button>
                    <p className={`text-xs ${currentTheme.textMuted} mt-2`}>
                      Doporučený formát: 3:2 (např. 300x200px)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>Model vozidla</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.carModel}
                      onChange={(e) => setTempProfile({...tempProfile, carModel: e.target.value})}
                      className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary}`}
                      placeholder="Mercedes S-Class"
                    />
                  ) : (
                    <p className={`${currentTheme.textPrimary} font-semibold mt-2`}>{driverProfile.carModel}</p>
                  )}
                </div>

                <div>
                  <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>Rok výroby</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.carYear}
                      onChange={(e) => setTempProfile({...tempProfile, carYear: e.target.value})}
                      className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary}`}
                      placeholder="2024"
                    />
                  ) : (
                    <p className={`${currentTheme.textPrimary} font-semibold mt-2`}>{driverProfile.carYear}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>SPZ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.spz}
                      onChange={(e) => setTempProfile({...tempProfile, spz: e.target.value})}
                      className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary}`}
                      placeholder="3A7 1234"
                    />
                  ) : (
                    <p className={`${currentTheme.textPrimary} font-semibold mt-2`}>{driverProfile.spz}</p>
                  )}
                </div>

                <div>
                  <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>Barva</label>
                  {isEditing ? (
                    <select
                      value={tempProfile.carColor}
                      onChange={(e) => setTempProfile({...tempProfile, carColor: e.target.value})}
                      className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary}`}
                    >
                      <option value="Černá">Černá</option>
                      <option value="Bílá">Bílá</option>
                      <option value="Stříbrná">Stříbrná</option>
                      <option value="Modrá">Modrá</option>
                      <option value="Červená">Červená</option>
                    </select>
                  ) : (
                    <p className={`${currentTheme.textPrimary} font-semibold mt-2`}>{driverProfile.carColor}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>Typ vozidla</label>
                {isEditing ? (
                  <select
                    value={tempProfile.carType}
                    onChange={(e) => setTempProfile({...tempProfile, carType: e.target.value})}
                    className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary}`}
                  >
                    <option value="standard">Standard</option>
                    <option value="minivan">Minivan</option>
                  </select>
                ) : (
                  <div className="mt-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      driverProfile.carType === 'minivan' 
                        ? `bg-gradient-to-r ${darkMode ? 'from-purple-800 to-purple-900 text-purple-300' : 'from-purple-100 to-purple-200 text-purple-700'}` 
                        : `bg-gradient-to-r ${darkMode ? 'from-teal-800 to-teal-900 text-teal-300' : 'from-teal-100 to-teal-200 text-teal-700'}`
                    }`}>
                      {driverProfile.carType === 'minivan' ? 'Minivan' : 'Standard'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
            {isEditing ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className={`flex-1 py-4 ${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-2xl font-semibold border ${currentTheme.borderStrong} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-all duration-300`}
                >
                  Zrušit
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Uložit změny
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Upravit profil
              </button>
            )}
          </div>

          <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
            <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-lg`}>Status registrace</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`${currentTheme.textPrimary} font-medium`}>Všeobecné podmínky</span>
                <CheckCircle className="text-teal-600" size={24} />
              </div>
              <div className="flex items-center justify-between">
                <span className={`${currentTheme.textPrimary} font-medium`}>Ověření telefonu</span>
                {isVerified ? (
                  <CheckCircle className="text-teal-600" size={24} />
                ) : (
                  <AlertCircle className="text-red-600" size={24} />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={`${currentTheme.textPrimary} font-medium`}>Schválení administrátorem</span>
                <CheckCircle className="text-teal-600" size={24} />
              </div>
            </div>
            
            <div className={`mt-6 p-4 bg-gradient-to-r ${darkMode ? 'from-teal-900 to-teal-800' : 'from-teal-50 to-teal-100'} rounded-2xl border ${darkMode ? 'border-teal-800' : 'border-teal-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-teal-300' : 'text-teal-800'} font-medium text-center`}>
                ✅ Váš profil je schválen a můžete jezdit
              </p>
            </div>
          </div>
        </div>

        {showPhoneVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className={`${currentTheme.cardBg} rounded-3xl p-8 w-full max-w-sm`}>
              <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-center text-xl`}>Ověření telefonu</h3>
              <p className={`text-sm ${currentTheme.textSecondary} mb-6 text-center`}>
                Zadejte ověřovací kód zaslaný na číslo {driverProfile.phone}
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Zadejte kód"
                className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mb-6 ${currentTheme.inputBg} ${currentTheme.textPrimary} text-center text-2xl font-mono`}
                maxLength="4"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPhoneVerification(false)}
                  className={`flex-1 py-4 ${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-2xl font-semibold border ${currentTheme.borderStrong}`}
                >
                  Zrušit
                </button>
                <button
                  onClick={verifyPhone}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-semibold"
                >
                  Ověřit
                </button>
              </div>
              <p className={`text-xs ${currentTheme.textMuted} text-center mt-4`}>
                Demo kód: 1234
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Nastavení
  const SettingsScreen = () => (
    <div className={`flex-1 ${currentTheme.bg} pb-16 overflow-y-auto`}>
      <div className={`${currentTheme.cardBg} p-6 ${currentTheme.shadow}`}>
        <h2 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>Nastavení</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
          <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-lg`}>Vzhled aplikace</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className={`${currentTheme.textPrimary} font-medium text-lg`}>Tmavý režim</span>
              <p className={`text-sm ${currentTheme.textMuted} mt-2`}>
                {darkMode ? 'Aktuálně zapnut' : 'Aktuálně vypnut'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-teal-600"></div>
            </label>
          </div>
        </div>

        <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
          <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-lg`}>Pracovní doba</h3>
          <div className="flex items-center justify-between mb-6">
            <span className={`${currentTheme.textPrimary} font-medium text-lg`}>Pouze v pracovní době</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={workingHours.enabled}
                onChange={(e) => setWorkingHours({...workingHours, enabled: e.target.checked})}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-teal-600"></div>
            </label>
          </div>
          {workingHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>Od</label>
                <input 
                  type="time" 
                  value={workingHours.from}
                  onChange={(e) => setWorkingHours({...workingHours, from: e.target.value})}
                  className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary}`}
                />
              </div>
              <div>
                <label className={`text-sm ${currentTheme.textSecondary} font-medium`}>Do</label>
                <input 
                  type="time" 
                  value={workingHours.to}
                  onChange={(e) => setWorkingHours({...workingHours, to: e.target.value})}
                  className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl mt-2 ${currentTheme.inputBg} ${currentTheme.textPrimary}`}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
          <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-lg`}>Notifikace</h3>
          <div className="space-y-4">
            {[
              { label: 'Zvukové upozornění', checked: true },
              { label: 'Vibrace', checked: true },
              { label: 'Prioritní objednávky', checked: true }
            ].map((item, index) => (
              <label key={index} className="flex items-center cursor-pointer group">
                <input type="checkbox" className="mr-4 w-6 h-6 text-teal-600 rounded border-gray-300" defaultChecked={item.checked} />
                <span className={`${currentTheme.textPrimary} font-medium group-hover:${currentTheme.textSecondary} transition-colors text-lg`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
          <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-lg`}>Údaje o vozidle</h3>
          <div className="space-y-4 text-sm">
            {[
              { label: 'Model:', value: driverProfile.carModel },
              { label: 'SPZ:', value: driverProfile.spz },
              { label: 'Barva:', value: driverProfile.carColor },
              { label: 'Typ:', value: driverProfile.carType === 'minivan' ? 'Minivan' : 'Standard' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between py-3">
                <span className={`${currentTheme.textSecondary} text-lg`}>{item.label}</span>
                <span className={`font-semibold ${currentTheme.textPrimary} text-lg`}>{item.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Upravit údaje
          </button>
        </div>

        <div className={`${currentTheme.cardBg} p-8 rounded-3xl ${currentTheme.shadow}`}>
          <h3 className={`font-bold ${currentTheme.textPrimary} mb-6 text-lg`}>Jazyk aplikace</h3>
          <select className={`w-full p-4 border ${currentTheme.borderStrong} rounded-2xl ${currentTheme.inputBg} ${currentTheme.textPrimary} font-medium text-lg`}>
            <option value="cs">Čeština</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen ${currentTheme.bg} max-w-md mx-auto relative`}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounceX {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(-2px);
          }
          60% {
            transform: translateX(2px);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .animate-bounceX {
          animation: bounceX 2s infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Status bar */}
      <div className={`${currentTheme.statusBar} text-white px-4 py-2 text-xs flex justify-between`}>
        <span className="font-medium">9:41</span>
        <div className="flex space-x-1">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Hlavní obsah */}
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'active-ride' && <ActiveRideScreen />}
      {currentScreen === 'history' && <HistoryScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}

      {/* Zobrazit novou objednávku */}
      {showNewRequest && <NewRequestScreen />}

      {/* Modal z mapou na cały ekran */}
      {renderMapModal()}

      {/* Spodní navigace - kompaktní */}
      <div 
        className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto ${currentTheme.navBg} border-t ${currentTheme.navBorder} z-40`}
        style={{
          boxShadow: darkMode 
            ? '0 -4px 12px rgba(20, 184, 166, 0.15), 0 -2px 4px rgba(20, 184, 166, 0.1)' 
            : '0 -4px 12px rgba(0, 0, 0, 0.15), 0 -2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex justify-around py-2">
          {[
            { icon: Home, label: 'Domů', screen: 'home' },
            { icon: History, label: 'Historie', screen: 'history' },
            { icon: Settings, label: 'Nastavení', screen: 'settings' },
            { icon: User, label: 'Profil', screen: 'profile' }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(item.screen)}
              className={`flex flex-col items-center p-2 transition-all duration-300 ${
                currentScreen === item.screen 
                  ? 'text-teal-600 scale-105' 
                  : `${currentTheme.textMuted} hover:${currentTheme.textSecondary}`
              }`}
            >
              <item.icon 
                size={20} 
                strokeWidth={currentScreen === item.screen ? 2.8 : 2.2}
                className={`transition-all duration-300 ${
                  currentScreen === item.screen ? 'drop-shadow-sm' : ''
                }`}
              />
              <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                currentScreen === item.screen ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxiDriverApp;
