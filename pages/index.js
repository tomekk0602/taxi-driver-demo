import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, MessageSquare, DollarSign, Clock, Calendar, Power, CheckCircle, XCircle, AlertCircle, User, Star, TrendingUp, Home, History, Camera, FileText, Settings, Bell, Users, Car, Plane } from 'lucide-react';

const TaxiDriverApp = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [hasActiveRide, setHasActiveRide] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [rideStatus, setRideStatus] = useState('waiting');
  const [todayEarnings, setTodayEarnings] = useState(2840);
  const [todayRides, setTodayRides] = useState(7);
  const [acceptTimer, setAcceptTimer] = useState(15);
  const [isRegistered, setIsRegistered] = useState(true);
  const [workingHours, setWorkingHours] = useState({ enabled: true, from: '08:00', to: '20:00' });
  const [driverProfile, setDriverProfile] = useState({
    name: 'Jan Novák',
    phone: '+420 777 123 456',
    spz: '3A7 1234',
    carColor: 'Černá',
    carModel: 'Škoda Superb',
    carYear: '2021',
    carType: 'standard',
    photo: null
  });

  // Simulace nové objednávky
  useEffect(() => {
    if (isOnline && !hasActiveRide && !showNewRequest) {
      const timer = setTimeout(() => {
        setShowNewRequest(true);
        setAcceptTimer(15);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasActiveRide, showNewRequest]);

  // Timer pro přijetí objednávky
  useEffect(() => {
    if (showNewRequest && acceptTimer > 0) {
      const timer = setTimeout(() => {
        setAcceptTimer(acceptTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (acceptTimer === 0) {
      setShowNewRequest(false);
      setAcceptTimer(15);
    }
  }, [showNewRequest, acceptTimer]);

  const acceptRide = () => {
    setShowNewRequest(false);
    setHasActiveRide(true);
    setRideStatus('waiting');
    setCurrentScreen('active-ride');
  };

  const rejectRide = () => {
    setShowNewRequest(false);
    setAcceptTimer(15);
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
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Status bar s gradientem */}
      <div className={`relative overflow-hidden transition-all duration-500 ${
        isOnline 
          ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600' 
          : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
      }`}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {isOnline ? 'Čekání na objednávky...' : 'Stiskněte pro začátek'}
              </p>
              {isOnline && !hasActiveRide && (
                <p className="text-xs text-green-100 mt-2 animate-pulse">
                  Demo: objednávka přijde za 3 sekundy
                </p>
              )}
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                transform transition-all duration-300 hover:scale-110 active:scale-95
                ${isOnline 
                  ? 'bg-white text-green-500 shadow-lg' 
                  : 'bg-white text-gray-500 shadow-lg hover:shadow-xl'
                }
              `}
            >
              <Power size={36} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        {/* Animated wave effect */}
        {isOnline && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Dnešní statistiky s card efektem */}
      <div className="p-4">
        <h3 className="text-gray-700 text-sm font-semibold mb-3">Dnešní přehled</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {todayEarnings.toLocaleString()} 
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Výdělek Kč </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {todayRides}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Jízdy</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info o autě s moderním designem */}
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mr-3">
                <Car className="text-gray-700" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{driverProfile.carModel}</p>
                <p className="text-sm text-gray-500">{driverProfile.spz}</p>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              driverProfile.carType === 'minivan' 
                ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700' 
                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
            }`}>
              {driverProfile.carType === 'minivan' ? 'Minivan' : 'Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Mapa s overlay efektem */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
              <MapPin size={48} className="text-gray-600 mx-auto" />
            </div>
            <p className="text-gray-700 font-semibold">Mapa s partnerskými hotely</p>
            {isOnline && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700 font-medium">Vaše poloha</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rychlé akce s hover efekty */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Clock, label: 'Přestávka' },
            { icon: Phone, label: 'Podpora' },
            { icon: MessageSquare, label: 'Chat' }
          ].map((item, index) => (
            <button
              key={index}
              className="group p-3 text-center rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 transition-all duration-300"
            >
              <div className="p-2 bg-gray-100 rounded-lg mx-auto w-fit group-hover:scale-110 transition-transform duration-300">
                <item.icon className="text-gray-600" size={20} />
              </div>
              <span className="text-sm text-gray-700 mt-2 block font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Obrazovka nové objednávky s animacemi
  const NewRequestScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col animate-fadeIn">
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl animate-slideUp">
          {/* Timer s pulzujícím efektem */}
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">NOVÁ OBJEDNÁVKA</h2>
                <p className="text-blue-100 mt-1">Prioritní nabídka</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold font-mono animate-pulse">{acceptTimer}s</div>
                <p className="text-xs text-blue-100">zbývá</p>
              </div>
            </div>
          </div>

          {/* Hotel info s gradientem */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                  <Users className="text-blue-600" size={20} />
                </div>
                <span className="font-bold text-gray-800">Hotel Augustine</span>
              </div>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-blue-600 shadow-sm">AUG</span>
            </div>
          </div>

          {/* Detaily trasy */}
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <MapPin size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">Hotel Augustine</p>
                  <p className="text-sm text-gray-600">Letenská 12/33, Praha 1</p>
                </div>
              </div>
              
              <div className="ml-12 mb-3">
                <div className="flex items-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-green-400 to-red-400 mr-3"></div>
                  <p className="text-sm text-gray-500">18.2 km • ~25 min</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Plane size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">Letiště Václava Havla</p>
                  <p className="text-sm text-gray-600">Terminál 2, Odlety</p>
                </div>
              </div>
            </div>

            {/* Detaily ceny s gradientem */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl mb-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Celková cena:</p>
                  <p className="text-3xl font-bold text-gray-800">900 Kč</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Váš příjem:</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">700 Kč</p>
                  <p className="text-xs text-gray-500 mt-1">po odečtení provize</p>
                </div>
              </div>
            </div>

            {/* Dodatečné info */}
            <div className="space-y-2">
              {[
                { icon: User, text: 'Recepce • Pokoj: 237' },
                { icon: Clock, text: 'Okamžitě' },
                { icon: FileText, text: 'Přepravní smlouva bude vygenerována' }
              ].map((item, index) => (
                <div key={index} className="flex items-center text-gray-600 text-sm">
                  <item.icon size={16} className="mr-2 text-gray-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tlačítka s hover efekty */}
          <div className="flex p-4 space-x-3 bg-gradient-to-t from-gray-100 to-gray-50">
            <button
              onClick={rejectRide}
              className="flex-1 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <XCircle className="mr-2" size={24} />
              Odmítnout
            </button>
            <button
              onClick={acceptRide}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <CheckCircle className="mr-2" size={24} />
              Přijmout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Obrazovka aktivní jízdy
  const ActiveRideScreen = () => (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Status jízdy s gradientem */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Aktivní jízda</h2>
            <p className="text-blue-100 mt-1">
              {rideStatus === 'waiting' && 'Jeďte k místu vyzvednutí'}
              {rideStatus === 'picked_up' && 'Cestující na palubě'}
              {rideStatus === 'in_progress' && 'Na cestě k cíli'}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-lg">
              700 Kč
            </div>
            <p className="text-xs mt-1 text-blue-100">váš příjem</p>
          </div>
        </div>
      </div>

      {/* Hotel a číslo objednávky */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 flex justify-between items-center border-b border-blue-100">
        <span className="font-bold text-gray-800">Hotel Augustine</span>
        <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">Objednávka #2847</span>
      </div>

      {/* Informace o trase s moderním designem */}
      <div className="bg-white m-4 rounded-2xl shadow-sm p-4">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="relative mr-3">
              <div className={`w-5 h-5 rounded-full ${
                rideStatus !== 'waiting' ? 'bg-green-500' : 'bg-gray-300'
              } transition-colors duration-300`}></div>
              {rideStatus !== 'waiting' && (
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Hotel Augustine</p>
              <p className="text-sm text-gray-600">Letenská 12/33, Praha 1</p>
              {rideStatus === 'waiting' && (
                <div className="mt-2 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                  <p className="text-xs text-blue-600 font-semibold">← Jeďte sem (3.5 km • 8 min)</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="relative mr-3">
              <div className={`w-5 h-5 rounded-full ${
                rideStatus === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
              } transition-colors duration-300`}></div>
              {rideStatus === 'in_progress' && (
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Letiště Václava Havla</p>
              <p className="text-sm text-gray-600">Terminál 2, Odlety</p>
              {rideStatus === 'in_progress' && (
                <div className="mt-2 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                  <p className="text-xs text-blue-600 font-semibold">← Cíl cesty (18.2 km • 22 min)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Údaje cestujícího */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                <User className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800">Recepce Augustine</p>
                <p className="text-sm text-gray-600">Pokoj 237</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-3 bg-gradient-to-br from-green-100 to-green-200 text-green-700 rounded-xl hover:shadow-md transition-all duration-300">
                <Phone size={20} />
              </button>
              <button className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-xl hover:shadow-md transition-all duration-300">
                <Navigation size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 relative mx-4 mb-4 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
              <Navigation size={48} className="text-blue-600 mx-auto" />
            </div>
            <p className="text-gray-700 font-bold mb-4">GPS Navigace</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Navigation className="mr-2" size={20} />
              Otevřít v Google Maps
            </button>
            <p className="text-sm text-gray-600 mt-4 font-medium">
              {rideStatus === 'waiting' && 'Do hotelu: 3.5 km • 8 min'}
              {rideStatus === 'picked_up' && 'Čekání na start'}
              {rideStatus === 'in_progress' && 'Na letiště: 18.2 km • 22 min'}
            </p>
          </div>
        </div>
      </div>

      {/* Tlačítko akce */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={updateRideStatus}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
            rideStatus === 'waiting' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
            rideStatus === 'picked_up' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
            'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          }`}
        >
          {rideStatus === 'waiting' && 'Jsem na místě'}
          {rideStatus === 'picked_up' && 'Zahájit jízdu'}
          {rideStatus === 'in_progress' && 'Ukončit jízdu'}
        </button>
      </div>
    </div>
  );

  // Historie s moderním designem
  const HistoryScreen = () => (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Historie jízd</h2>
            <p className="text-sm text-gray-600 mt-1">Celkem jízd: 127</p>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 font-medium">
            <option>Tento týden</option>
            <option>Tento měsíc</option>
            <option>Vše</option>
          </select>
        </div>
      </div>

      <div className="p-4 space-y-3">
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
          <div key={index} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1 rounded-full font-semibold">{ride.hotel}</span>
                  {ride.invoiced && (
                    <span className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1 rounded-full ml-2 font-semibold">Faktura</span>
                  )}
                </div>
                <p className="font-bold text-gray-800">{ride.from}</p>
                <p className="text-sm text-gray-600 mt-1">→ {ride.to}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{ride.price} Kč</p>
                <p className="text-xs text-gray-500">z {ride.commission} Kč</p>
                <p className="text-xs text-gray-400 mt-1">{ride.date} • {ride.time}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < ride.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2 font-medium">({ride.rating}.0)</span>
              </div>
              <button className="text-blue-600 text-sm flex items-center font-semibold hover:text-blue-700 transition-colors">
                <FileText size={16} className="mr-1" />
                Smlouva
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Zobrazit celou historii
        </button>
      </div>
    </div>
  );

  // Nastavení s moderním designem
  const SettingsScreen = () => (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Nastavení</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Pracovní doba */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Pracovní doba</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Pouze v pracovní době</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={workingHours.enabled}
                onChange={(e) => setWorkingHours({...workingHours, enabled: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600"></div>
            </label>
          </div>
          {workingHours.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 font-medium">Od</label>
                <input 
                  type="time" 
                  value={workingHours.from}
                  onChange={(e) => setWorkingHours({...workingHours, from: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Do</label>
                <input 
                  type="time" 
                  value={workingHours.to}
                  onChange={(e) => setWorkingHours({...workingHours, to: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl mt-1 bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notifikace */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Notifikace</h3>
          <div className="space-y-3">
            {[
              { label: 'Zvukové upozornění', checked: true },
              { label: 'Vibrace', checked: true },
              { label: 'Prioritní objednávky', checked: true }
            ].map((item, index) => (
              <label key={index} className="flex items-center cursor-pointer group">
                <input type="checkbox" className="mr-3 w-5 h-5 text-blue-600 rounded border-gray-300" defaultChecked={item.checked} />
                <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Info o autě */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Údaje o vozidle</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Model:', value: driverProfile.carModel },
              { label: 'SPZ:', value: driverProfile.spz },
              { label: 'Barva:', value: driverProfile.carColor },
              { label: 'Typ:', value: driverProfile.carType === 'minivan' ? 'Minivan' : 'Standard' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Upravit údaje
          </button>
        </div>

        {/* Jazyk */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Jazyk aplikace</h3>
          <select className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 font-medium">
            <option value="cs">Čeština</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 max-w-md mx-auto">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>

      {/* Status bar */}
      <div className="bg-gray-900 text-white px-4 py-2 text-xs flex justify-between">
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

      {/* Zobrazit novou objednávku */}
      {showNewRequest && <NewRequestScreen />}

      {/* Spodní navigace s moderním designem */}
      {!hasActiveRide && (
        <div className="bg-white border-t border-gray-100">
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
                    ? 'text-blue-600 scale-110' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon size={24} strokeWidth={currentScreen === item.screen ? 2.5 : 2} />
                <span className={`text-xs mt-1 ${
                  currentScreen === item.screen ? 'font-semibold' : 'font-medium'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxiDriverApp;