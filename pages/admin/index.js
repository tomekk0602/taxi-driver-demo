import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Building2, Route, Settings, BarChart3, MessageSquare, 
  Plus, Search, Filter, Bell, Moon, Sun, Menu, X, 
  CheckCircle, XCircle, Clock, MapPin, Car, Phone, 
  Edit, Trash2, Ban, UserCheck, DollarSign, TrendingUp,
  Calendar, AlertTriangle, Send, Eye, EyeOff
} from 'lucide-react';

const TaxiAdminApp = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Inicjalizovat správné zobrazení menu podle velikosti obrazovky
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    
    const handleResize = (e) => {
      setSidebarOpen(e.matches);
    };

    setSidebarOpen(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  // Demo data
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Jan Novák', phone: '+420 777 123 456', car: 'Mercedes S-Class', carImage: '/mercedes-s-class.jpg', status: 'online', type: 'standard', approved: true, banned: false },
    { id: 2, name: 'Petr Svoboda', phone: '+420 777 234 567', car: 'Mercedes V-Class', carImage: '/mercedes-v-class.webp', status: 'online', type: 'luxury-van', approved: true, banned: false },
    { id: 3, name: 'Marie Dvořáková', phone: '+420 777 345 678', car: 'BMW 7 Series', carImage: '/bmw-7-series.webp', status: 'online', type: 'standard', approved: true, banned: false },
    { id: 4, name: 'Pavel Novotný', phone: '+420 777 456 789', car: 'Mercedes Sprinter', carImage: '/mercedes-sprinter.webp', status: 'busy', type: 'luxury-van', approved: true, banned: false },
    { id: 5, name: 'Tomáš Černý', phone: '+420 777 567 890', car: 'Audi A8', carImage: '/audi-a8.webp', status: 'offline', type: 'standard', approved: true, banned: false },
    { id: 6, name: 'Anna Svobodová', phone: '+420 777 678 901', car: 'BMW X7', carImage: '/bmw-x7.webp', status: 'online', type: 'standard', approved: false, banned: false },
    { id: 7, name: 'David Procházka', phone: '+420 777 789 012', car: 'Škoda Superb', carImage: '/skoda-superb.webp', status: 'online', type: 'standard', approved: true, banned: true }
  ]);

  const [hotels, setHotels] = useState([
    { id: 1, name: 'Hotel Augustine', shortcut: 'aug', address: 'Letenská 12/33, Praha 1', routes: [
      { destination: 'Letiště', price: 900, commission: 200 },
      { destination: 'Hlavní nádraží', price: 500, commission: 100 },
      { destination: 'Kongresové centrum', price: 400, commission: 80 }
    ]},
    { id: 2, name: 'Hotel Hilton', shortcut: 'hil', address: 'Pobřežní 1, Praha 8', routes: [
      { destination: 'Letiště', price: 800, commission: 150 },
      { destination: 'Wenceslas Square', price: 300, commission: 60 }
    ]},
    { id: 3, name: 'Four Seasons', shortcut: '4s', address: 'Veleslavínova 2a, Praha 1', routes: [
      { destination: 'Letiště', price: 1200, commission: 300 },
      { destination: 'Hlavní nádraží', price: 600, commission: 120 }
    ]}
  ]);

  const [activeOrders, setActiveOrders] = useState([
    { 
      id: 1, 
      hotel: 'Augustine', 
      destination: 'Letiště', 
      driver: 'Jan Novák', 
      status: 'in_progress', 
      time: '14:30',
      createdAt: Date.now() - 300000,
      assignedAt: Date.now() - 240000,
      price: 900,
      commission: 200
    },
    { 
      id: 2, 
      hotel: 'Hilton', 
      destination: 'Hlavní nádraží', 
      driver: null, 
      status: 'waiting', 
      time: '14:45',
      createdAt: Date.now() - 120000,
      assignedAt: null,
      autoAssignAt: Date.now() - 120000 + 900000,
      price: 500,
      commission: 100
    },
    { 
      id: 3, 
      hotel: 'Four Seasons', 
      destination: 'Letiště', 
      driver: 'Petr Svoboda', 
      status: 'completed', 
      time: '13:15',
      createdAt: Date.now() - 3600000,
      assignedAt: Date.now() - 3500000,
      price: 1200,
      commission: 300
    }
  ]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Auto-assign orders after 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.status === 'waiting' && !order.driver && order.autoAssignAt <= Date.now()) {
            const availableDrivers = drivers.filter(d => d.status === 'online' && d.approved && !d.banned);
            if (availableDrivers.length > 0) {
              const assignedDriver = availableDrivers[0];
              return {
                ...order,
                driver: assignedDriver.name,
                status: 'in_progress',
                assignedAt: Date.now()
              };
            }
          }
          return order;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [drivers]);

  // Time remaining helper
  const getTimeRemaining = (order) => {
    if (order.status !== 'waiting' || order.driver) return null;
    const remaining = Math.max(0, order.autoAssignAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return { minutes, seconds, total: remaining };
  };

  // Catch Transfer inspired theme
  const theme = {
    light: {
      bg: 'bg-gray-50',
      cardBg: 'bg-white',
      sidebarBg: 'bg-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      border: 'border-gray-100',
      hover: 'hover:bg-gray-50',
      input: 'bg-white border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100',
      shadow: 'shadow-sm',
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
      sidebarBg: 'bg-gray-800',
      textPrimary: 'text-gray-100',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-700',
      input: 'bg-gray-700 border-gray-600 focus:border-teal-400',
      shadow: 'shadow-lg shadow-black/20',
      primary: 'bg-teal-500',
      primaryHover: 'hover:bg-teal-600', 
      primaryText: 'text-teal-400',
      success: 'text-teal-400',
      warning: 'text-amber-400',
      danger: 'text-red-400'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'drivers', label: 'Řidiči', icon: Users },
    { id: 'hotels', label: 'Hotely', icon: Building2 },
    { id: 'orders', label: 'Objednávky', icon: Route },
    { id: 'statistics', label: 'Statistiky', icon: BarChart3 },
    { id: 'settings', label: 'Nastavení', icon: Settings },
    { id: 'messages', label: 'Zprávy', icon: MessageSquare }
  ];

  // Assign Driver Modal
  const AssignDriverModal = () => {
    if (!showAssignModal || !selectedOrder) return null;

    const availableDrivers = drivers.filter(d => d.status === 'online' && d.approved && !d.banned);

    const assignDriver = (driverName) => {
      setActiveOrders(prev => prev.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, driver: driverName, status: 'in_progress', assignedAt: Date.now() }
          : order
      ));
      setShowAssignModal(false);
      setSelectedOrder(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${currentTheme.cardBg} rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col p-8 shadow-2xl`}>
          <div className="flex justify-between items-center mb-8 flex-shrink-0">
            <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Přidělit řidiče</h3>
            <button 
              onClick={() => setShowAssignModal(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className={currentTheme.textMuted} size={24} />
            </button>
          </div>

          <div className="mb-8 p-6 bg-teal-50 rounded-2xl border border-teal-100 flex-shrink-0">
            <p className={`text-sm font-medium ${currentTheme.textSecondary} mb-2`}>Objednávka:</p>
            <p className={`text-xl font-bold ${currentTheme.textPrimary}`}>
              {selectedOrder.hotel} → {selectedOrder.destination}
            </p>
            <div className="flex justify-between mt-4 text-sm">
              <span className={currentTheme.textMuted}>Cena: <span className="font-semibold text-teal-600">{selectedOrder.price} Kč</span></span>
              <span className={currentTheme.textMuted}>Provize: <span className="font-semibold">{selectedOrder.commission} Kč</span></span>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <p className={`text-lg font-semibold ${currentTheme.textSecondary}`}>
                Dostupní řidiči
              </p>
              <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                {availableDrivers.length} online
              </span>
            </div>
            
            {availableDrivers.length === 0 ? (
              <div className="text-center py-12 flex-1 flex flex-col justify-center">
                <Users className={`mx-auto mb-4 ${currentTheme.textMuted}`} size={48} />
                <p className={`${currentTheme.textMuted} mb-2 text-lg`}>Žádní dostupní řidiči</p>
                <p className="text-sm text-gray-400">Objednávka bude automaticky přidělena</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(90vh - 350px)' }}>
                <div className="space-y-4">
                  {availableDrivers.map(driver => (
                    <button
                      key={driver.id}
                      onClick={() => assignDriver(driver.name)}
                      className={`w-full p-6 text-left rounded-2xl border-2 border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 group`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">{driver.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-teal-700 text-lg">{driver.name}</p>
                              <p className="text-sm text-gray-500">{driver.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Car image placeholder */}
                              <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                <img 
                                  src={driver.carImage} 
                                  alt={driver.car}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <Car size={16} className="text-gray-400" style={{ display: 'none' }} />
                              </div>
                              <span className="text-sm text-gray-600 font-medium">{driver.car}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              driver.type === 'luxury-van' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {driver.type === 'luxury-van' ? 'Luxury Van' : 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex space-x-4 flex-shrink-0">
            <button 
              onClick={() => setShowAssignModal(false)}
              className="flex-1 px-6 py-4 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors font-medium"
            >
              Zrušit
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Quick Order Modal
  const QuickOrderModal = () => {
    const [quickInput, setQuickInput] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(null);

    const handleQuickInput = (input) => {
      setQuickInput(input);
      const hotel = hotels.find(h => 
        h.shortcut.toLowerCase() === input.toLowerCase() || 
        h.name.toLowerCase().includes(input.toLowerCase())
      );
      
      if (hotel && hotel.routes.length > 0) {
        setSelectedRoute({ hotel, routes: hotel.routes });
      }
    };

    const createOrder = (route) => {
      const now = Date.now();
      const newOrder = {
        id: now,
        hotel: selectedRoute.hotel.name,
        destination: route.destination,
        driver: null,
        status: 'waiting',
        time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
        price: route.price,
        commission: route.commission,
        createdAt: now,
        assignedAt: null,
        autoAssignAt: now + 900000
      };
      
      setActiveOrders([newOrder, ...activeOrders]);
      setShowQuickOrder(false);
      setQuickInput('');
      setSelectedRoute(null);
    };

    if (!showQuickOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${currentTheme.cardBg} rounded-3xl max-w-md w-full p-8 shadow-2xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Rychlá objednávka</h3>
            <button 
              onClick={() => setShowQuickOrder(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className={currentTheme.textMuted} size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`text-sm font-medium ${currentTheme.textSecondary} mb-3 block`}>Zadejte zkratku hotelu</label>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => handleQuickInput(e.target.value)}
                placeholder="aug, hil, 4s..."
                className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} text-lg`}
              />
              <p className={`text-xs ${currentTheme.textMuted} mt-2`}>
                Příklad: aug = Augustine, hil = Hilton
              </p>
            </div>

            {selectedRoute && (
              <div>
                <h4 className={`font-semibold ${currentTheme.textPrimary} mb-4 text-lg`}>
                  {selectedRoute.hotel.name}
                </h4>
                <div className="space-y-3">
                  {selectedRoute.routes.map((route, index) => (
                    <button
                      key={index}
                      onClick={() => createOrder(route)}
                      className={`w-full p-4 text-left rounded-2xl border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 transition-all`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-lg">{route.destination}</span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-teal-600">{route.price} Kč</div>
                          <div className="text-xs text-gray-500">Provize: {route.commission} Kč</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Orders Screen
  const OrdersScreen = () => {
    const waitingOrders = activeOrders.filter(o => o.status === 'waiting');
    const inProgressOrders = activeOrders.filter(o => o.status === 'in_progress');
    const completedOrders = activeOrders.filter(o => o.status === 'completed');

    const OrderCard = ({ order }) => {
      const timeRemaining = getTimeRemaining(order);
      
      return (
        <div className={`${currentTheme.cardBg} p-6 rounded-3xl shadow-sm border-l-4 ${
          order.status === 'waiting' ? 'border-amber-400' :
          order.status === 'in_progress' ? 'border-teal-400' :
          'border-green-400'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h4 className={`font-semibold ${currentTheme.textPrimary} text-lg`}>
                  {order.hotel} → {order.destination}
                </h4>
                <span className={`px-3 py-2 rounded-full text-xs font-medium ${
                  order.status === 'waiting' ? 'bg-amber-100 text-amber-800' :
                  order.status === 'in_progress' ? 'bg-teal-100 text-teal-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status === 'waiting' ? 'Čeká na řidiče' : 
                   order.status === 'in_progress' ? 'V průběhu' : 'Dokončeno'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className={currentTheme.textMuted}>Čas objednávky:</p>
                  <p className={`${currentTheme.textSecondary} font-medium`}>{order.time}</p>
                </div>
                <div>
                  <p className={currentTheme.textMuted}>Řidič:</p>
                  <p className={`${currentTheme.textSecondary} font-medium`}>
                    {order.driver || 'Nepřidělen'}
                  </p>
                </div>
                <div>
                  <p className={currentTheme.textMuted}>Cena:</p>
                  <p className={`font-semibold text-teal-600 text-lg`}>{order.price} Kč</p>
                </div>
                <div>
                  <p className={currentTheme.textMuted}>Provize:</p>
                  <p className={`${currentTheme.textSecondary} font-medium`}>{order.commission} Kč</p>
                </div>
              </div>

              {order.status === 'waiting' && !order.driver && timeRemaining && (
                <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800">
                      Automatické přidělení za:
                    </span>
                    <span className={`font-mono font-bold text-xl ${
                      timeRemaining.total < 300000 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {String(timeRemaining.minutes).padStart(2, '0')}:
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </span>
                  </div>
                  {timeRemaining.total < 300000 && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Méně než 5 minut do automatického přidělení!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {order.status === 'waiting' && !order.driver && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowAssignModal(true);
                }}
                className={`flex-1 px-6 py-4 ${currentTheme.primary} text-white rounded-2xl ${currentTheme.primaryHover} transition-colors font-medium`}
              >
                Přidělit řidiče
              </button>
              <button className="px-6 py-4 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 transition-colors font-medium">
                Zrušit
              </button>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>Správa objednávek</h2>
          <button 
            onClick={() => setShowQuickOrder(true)}
            className={`px-6 py-4 ${currentTheme.primary} text-white rounded-2xl ${currentTheme.primaryHover} transition-colors flex items-center space-x-3 font-medium`}
          >
            <Plus size={20} />
            <span>Nová objednávka</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${currentTheme.cardBg} p-6 rounded-3xl shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted} mb-2`}>Čekající</p>
                <p className={`text-3xl font-bold text-amber-600`}>{waitingOrders.length}</p>
              </div>
              <div className="p-4 bg-amber-100 rounded-2xl">
                <Clock className="text-amber-600" size={24} />
              </div>
            </div>
          </div>
          <div className={`${currentTheme.cardBg} p-6 rounded-3xl shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted} mb-2`}>V průběhu</p>
                <p className={`text-3xl font-bold text-teal-600`}>{inProgressOrders.length}</p>
              </div>
              <div className="p-4 bg-teal-100 rounded-2xl">
                <Route className="text-teal-600" size={24} />
              </div>
            </div>
          </div>
          <div className={`${currentTheme.cardBg} p-6 rounded-3xl shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted} mb-2`}>Dokončené</p>
                <p className={`text-3xl font-bold text-green-600`}>{completedOrders.length}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-2xl">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Waiting Orders */}
        {waitingOrders.length > 0 && (
          <div>
            <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-6 text-amber-600`}>
              🕐 Čekající objednávky ({waitingOrders.length})
            </h3>
            <div className="space-y-6">
              {waitingOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* In Progress Orders */}
        {inProgressOrders.length > 0 && (
          <div>
            <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-6 text-teal-600`}>
              🚗 Objednávky v průběhu ({inProgressOrders.length})
            </h3>
            <div className="space-y-6">
              {inProgressOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div>
            <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-6 text-green-600`}>
              ✅ Dokončené objednávky ({completedOrders.length})
            </h3>
            <div className="space-y-6">
              {completedOrders.slice(0, 5).map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {completedOrders.length > 5 && (
              <button className="w-full p-4 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-gray-300">
                Zobrazit dalších {completedOrders.length - 5} objednávek
              </button>
            )}
          </div>
        )}

        {activeOrders.length === 0 && (
          <div className={`${currentTheme.cardBg} p-12 rounded-3xl shadow-sm text-center`}>
            <Route className={`mx-auto mb-6 ${currentTheme.textMuted}`} size={64} />
            <h3 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-3`}>
              Žádné objednávky
            </h3>
            <p className={`${currentTheme.textMuted} mb-6`}>
              Zatím nejsou žádné aktivní objednávky.
            </p>
            <button 
              onClick={() => setShowQuickOrder(true)}
              className={`px-8 py-4 ${currentTheme.primary} text-white rounded-2xl ${currentTheme.primaryHover} transition-colors font-medium`}
            >
              Vytvořit první objednávku
            </button>
          </div>
        )}
      </div>
    );
  };

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Online řidiči', value: drivers.filter(d => d.status === 'online').length, icon: Users, color: 'teal' },
          { label: 'Aktivní jízdy', value: activeOrders.filter(o => o.status === 'in_progress').length, icon: Route, color: 'blue' },
          { label: 'Čekající objednávky', value: activeOrders.filter(o => o.status === 'waiting').length, icon: Clock, color: 'amber' },
          { label: 'Dnes ukončeno', value: activeOrders.filter(o => o.status === 'completed').length, icon: CheckCircle, color: 'green' }
        ].map((stat, index) => (
          <div key={index} className={`${currentTheme.cardBg} p-8 rounded-3xl shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted} mb-2`}>{stat.label}</p>
                <p className={`text-4xl font-bold ${currentTheme.textPrimary} mt-2`}>{stat.value}</p>
              </div>
              <div className={`p-4 bg-${stat.color}-100 rounded-2xl`}>
                <stat.icon className={`text-${stat.color}-600`} size={32} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`${currentTheme.cardBg} p-8 rounded-3xl shadow-sm`}>
        <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-6`}>Rychlé akce</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button 
            onClick={() => setShowQuickOrder(true)}
            className={`p-6 ${currentTheme.primary} text-white rounded-2xl ${currentTheme.primaryHover} transition-colors flex flex-col items-center`}
          >
            <Plus size={32} className="mb-3" />
            <span className="font-medium">Nová objednávka</span>
          </button>
          <button className="p-6 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors flex flex-col items-center">
            <UserCheck size={32} className="mb-3" />
            <span className="font-medium">Schválit řidiče</span>
          </button>
          <button className="p-6 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-colors flex flex-col items-center">
            <MessageSquare size={32} className="mb-3" />
            <span className="font-medium">Poslat zprávu</span>
          </button>
          <button className="p-6 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors flex flex-col items-center">
            <BarChart3 size={32} className="mb-3" />
            <span className="font-medium">Statistiky</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`${currentTheme.cardBg} p-8 rounded-3xl shadow-sm`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${currentTheme.textPrimary}`}>Aktuální objednávky</h3>
          <button 
            onClick={() => setCurrentScreen('orders')}
            className={`${currentTheme.primaryText} hover:text-teal-700 font-medium`}
          >
            Zobrazit vše
          </button>
        </div>
        <div className="space-y-4">
          {activeOrders.slice(0, 5).map(order => (
            <div key={order.id} className={`p-6 border rounded-2xl ${currentTheme.border} ${currentTheme.hover} transition-colors`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-semibold ${currentTheme.textPrimary} mb-1`}>
                    {order.hotel} → {order.destination}
                  </p>
                  <p className={`text-sm ${currentTheme.textSecondary}`}>
                    {order.driver ? `Řidič: ${order.driver}` : 'Čeká na řidiče'} • {order.time}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-2 rounded-full text-xs font-medium ${
                    order.status === 'waiting' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'in_progress' ? 'bg-teal-100 text-teal-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status === 'waiting' ? 'Čeká' : 
                     order.status === 'in_progress' ? 'Jede' : 'Dokončeno'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Drivers Screen
  const DriversScreen = () => {
    const DesktopTable = () => (
      <div className="hidden md:block">
        <div className={`${currentTheme.cardBg} rounded-3xl shadow-sm overflow-hidden`}>
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className={`text-xl font-bold ${currentTheme.textPrimary}`}>Všichni řidiči</h3>
              <div className="flex space-x-3">
                <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                  Online ({drivers.filter(d => d.status === 'online').length})
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Celkem ({drivers.length})
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${currentTheme.bg}`}>
                <tr>
                  <th className={`text-left p-6 ${currentTheme.textSecondary} font-medium`}>Řidič</th>
                  <th className={`text-left p-6 ${currentTheme.textSecondary} font-medium`}>Vozidlo</th>
                  <th className={`text-left p-6 ${currentTheme.textSecondary} font-medium`}>Status</th>
                  <th className={`text-left p-6 ${currentTheme.textSecondary} font-medium`}>Typ</th>
                  <th className={`text-left p-6 ${currentTheme.textSecondary} font-medium`}>Akce</th>
                </tr>
              </thead>
              <tbody>
                {drivers.filter(d => d.approved).map(driver => (
                  <tr key={driver.id} className={`border-t ${currentTheme.border} ${currentTheme.hover}`}>
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{driver.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className={`font-semibold ${currentTheme.textPrimary}`}>{driver.name}</p>
                          <p className={`text-sm ${currentTheme.textSecondary}`}>{driver.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        {/* Car image placeholder */}
                        <div className="w-16 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={driver.carImage} 
                            alt={driver.car}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <Car size={20} className="text-gray-400" style={{ display: 'none' }} />
                        </div>
                        <p className={`${currentTheme.textPrimary} font-medium`}>{driver.car}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-2 rounded-full text-xs font-medium ${
                        driver.status === 'online' ? 'bg-teal-100 text-teal-800' :
                        driver.status === 'busy' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status === 'online' ? 'Online' : 
                         driver.status === 'busy' ? 'Zaneprázdněn' : 'Offline'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-2 rounded-full text-xs font-medium ${
                        driver.type === 'luxury-van' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {driver.type === 'luxury-van' ? 'Luxury Van' : 'Standard'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex space-x-2">
                        <button className="p-3 text-teal-600 hover:bg-teal-100 rounded-xl transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-3 text-orange-600 hover:bg-orange-100 rounded-xl transition-colors">
                          <Ban size={16} />
                        </button>
                        <button className="p-3 text-green-600 hover:bg-green-100 rounded-xl transition-colors">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    const MobileCards = () => (
      <div className="md:hidden space-y-6">
        {drivers.filter(d => d.approved).map(driver => (
          <div key={driver.id} className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-6 shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{driver.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className={`font-semibold ${currentTheme.textPrimary}`}>{driver.name}</h4>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                    <Phone size={12} />
                    <span>{driver.phone}</span>
                  </div>
                </div>
              </div>
              
              <span className={`px-3 py-2 rounded-full text-xs font-medium ${
                driver.status === 'online' ? 'bg-teal-100 text-teal-800' :
                driver.status === 'busy' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {driver.status === 'online' ? 'Online' : 
                 driver.status === 'busy' ? 'Zaneprázdněn' : 'Offline'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                {/* Car image placeholder */}
                <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src={driver.carImage} 
                    alt={driver.car}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <Car size={14} className="text-gray-400" style={{ display: 'none' }} />
                </div>
                <span className={`text-sm ${currentTheme.textSecondary} font-medium`}>{driver.car}</span>
              </div>
              <div className="flex justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  driver.type === 'luxury-van' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {driver.type === 'luxury-van' ? 'Luxury Van' : 'Standard'}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="p-3 text-teal-600 hover:bg-teal-100 rounded-xl transition-colors">
                <Edit size={16} />
              </button>
              <button className="p-3 text-orange-600 hover:bg-orange-100 rounded-xl transition-colors">
                <Ban size={16} />
              </button>
              <button className="p-3 text-green-600 hover:bg-green-100 rounded-xl transition-colors">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h2 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>Správa řidičů</h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className={`absolute left-4 top-4 ${currentTheme.textMuted}`} size={20} />
              <input
                type="text"
                placeholder="Hledat řidiče..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-12 pr-6 py-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} w-full sm:w-auto text-lg`}
              />
            </div>
            <button className={`px-6 py-4 ${currentTheme.primary} text-white rounded-2xl ${currentTheme.primaryHover} transition-colors flex items-center justify-center font-medium`}>
              <Plus size={20} className="mr-3" />
              <span>Přidat řidiče</span>
            </button>
          </div>
        </div>

        {/* Pending Approvals */}
        {drivers.some(d => !d.approved) && (
          <div className={`${currentTheme.cardBg} p-8 rounded-3xl shadow-sm`}>
            <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-6 text-orange-600`}>
              Čekající schválení ({drivers.filter(d => !d.approved).length})
            </h3>
            <div className="space-y-4">
              {drivers.filter(d => !d.approved).map(driver => (
                <div key={driver.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 bg-orange-50 rounded-2xl space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{driver.name.charAt(0)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-semibold">{driver.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{driver.phone}</span>
                          <span>•</span>
                          <span>{driver.car}</span>
                        </div>
                      </div>
                      {/* Car image placeholder */}
                      <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden ml-3">
                        <img 
                          src={driver.carImage} 
                          alt={driver.car}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <Car size={14} className="text-gray-400" style={{ display: 'none' }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => {
                        setDrivers(drivers.map(d => d.id === driver.id ? {...d, approved: true} : d));
                      }}
                      className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 flex-1 sm:flex-initial font-medium"
                    >
                      Schválit
                    </button>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 flex-1 sm:flex-initial font-medium">
                      Odmítnout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DesktopTable />
        <MobileCards />
      </div>
    );
  };

  // Settings Screen  
  const SettingsScreen = () => (
    <div className="space-y-8">
      <h2 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>Nastavení systému</h2>
      
      <div className={`${currentTheme.cardBg} p-8 rounded-3xl shadow-sm`}>
        <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-6`}>Nastavení provizí</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-3`}>
              Provize hotelu (%)
            </label>
            <input 
              type="number" 
              defaultValue="15"
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} text-lg`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-3`}>
              Provize řidiče (%)
            </label>
            <input 
              type="number" 
              defaultValue="75"
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} text-lg`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-3`}>
              Provize administrátora (%)
            </label>
            <input 
              type="number" 
              defaultValue="10"
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} text-lg`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-3`}>
              Dodatečná provize (%)
            </label>
            <input 
              type="number" 
              defaultValue="0"
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} text-lg`}
            />
          </div>
        </div>
      </div>

      <div className={`${currentTheme.cardBg} p-8 rounded-3xl shadow-sm`}>
        <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-6`}>Časové nastavení</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-3`}>
              Doba pro přijetí objednávky (sekundy)
            </label>
            <input 
              type="number" 
              defaultValue="15"
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} text-lg`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-3`}>
              Prioritní doba pro VIP řidiče (sekundy)
            </label>
            <input 
              type="number" 
              defaultValue="15"
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.textPrimary} text-lg`}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="px-8 py-4 border border-gray-200 rounded-2xl hover:bg-gray-50 font-medium">
          Zrušit
        </button>
        <button className={`px-8 py-4 ${currentTheme.primary} text-white rounded-2xl ${currentTheme.primaryHover} font-medium`}>
          Uložit změny
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-200`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 ${currentTheme.sidebarBg} shadow-sm transform transition-transform duration-200 z-30 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <h1 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Taxi Admin</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <X className={currentTheme.textMuted} size={20} />
            </button>
          </div>

          <nav className="space-y-3">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentScreen(item.id);
                  if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-200 ${
                  currentScreen === item.id 
                    ? 'bg-teal-100 text-teal-700 font-medium' 
                    : `${currentTheme.textSecondary} ${currentTheme.hover} font-medium`
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className={`${currentTheme.cardBg} shadow-sm px-8 py-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Menu className={currentTheme.textMuted} size={20} />
            </button>
            <h2 className={`text-xl font-semibold ${currentTheme.textPrimary} capitalize`}>
              {menuItems.find(item => item.id === currentScreen)?.label}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-3 hover:bg-gray-100 rounded-2xl transition-colors">
              <Bell className={currentTheme.textMuted} size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              {darkMode ? <Sun className={currentTheme.textMuted} size={20} /> : <Moon className={currentTheme.textMuted} size={20} />}
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <span className={`font-medium ${currentTheme.textPrimary}`}>Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {currentScreen === 'dashboard' && <DashboardScreen />}
          {currentScreen === 'drivers' && <DriversScreen />}
          {currentScreen === 'orders' && <OrdersScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </div>
      </div>

      {/* Modals */}
      <QuickOrderModal />
      <AssignDriverModal />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TaxiAdminApp;

