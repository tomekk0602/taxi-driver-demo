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

    // Nastavit při prvním načtení
    setSidebarOpen(mediaQuery.matches);

    // Poslouchat změny velikosti
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  // Demo data
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Jan Novák', phone: '+420 777 123 456', car: 'Škoda Superb', status: 'online', type: 'standard', approved: true, banned: false },
    { id: 2, name: 'Petr Svoboda', phone: '+420 777 234 567', car: 'Mercedes V-Class', status: 'online', type: 'minivan', approved: true, banned: false },
    { id: 3, name: 'Marie Dvořáková', phone: '+420 777 345 678', car: 'Toyota Camry', status: 'online', type: 'standard', approved: true, banned: false },
    { id: 4, name: 'Pavel Novotný', phone: '+420 777 456 789', car: 'Volkswagen Caravelle', status: 'busy', type: 'minivan', approved: true, banned: false },
    { id: 5, name: 'Tomáš Černý', phone: '+420 777 567 890', car: 'BMW 5 Series', status: 'offline', type: 'standard', approved: true, banned: false },
    { id: 6, name: 'Anna Svobodová', phone: '+420 777 678 901', car: 'Audi A6', status: 'online', type: 'standard', approved: false, banned: false },
    { id: 7, name: 'David Procházka', phone: '+420 777 789 012', car: 'Ford Transit', status: 'online', type: 'minivan', approved: true, banned: true }
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
      createdAt: Date.now() - 300000, // 5 minut temu
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
      createdAt: Date.now() - 120000, // 2 minuty temu
      assignedAt: null,
      autoAssignAt: Date.now() - 120000 + 900000, // 15 minut od utworzenia
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
      createdAt: Date.now() - 3600000, // 1 godzinę temu
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
            // Auto-assign to first available online driver
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

  const theme = {
    light: {
      bg: 'bg-gray-50',
      cardBg: 'bg-white',
      sidebarBg: 'bg-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50',
      input: 'bg-white border-gray-300',
      shadow: 'shadow-sm'
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
      input: 'bg-gray-700 border-gray-600',
      shadow: 'shadow-lg shadow-black/20'
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
        <div className={`${currentTheme.cardBg} rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col p-6 ${currentTheme.shadow}`}>
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h3 className={`text-xl font-bold ${currentTheme.textPrimary}`}>Přidělit řidiče objednávce</h3>
            <button onClick={() => setShowAssignModal(false)}>
              <X className={currentTheme.textMuted} size={24} />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex-shrink-0">
            <p className={`text-sm font-medium ${currentTheme.textSecondary} mb-1`}>Objednávka:</p>
            <p className={`text-lg font-bold ${currentTheme.textPrimary}`}>
              {selectedOrder.hotel} → {selectedOrder.destination}
            </p>
            <div className="flex justify-between mt-2 text-sm">
              <span className={currentTheme.textMuted}>Cena: <span className="font-semibold text-green-600">{selectedOrder.price} Kč</span></span>
              <span className={currentTheme.textMuted}>Provize: <span className="font-semibold">{selectedOrder.commission} Kč</span></span>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <p className={`text-lg font-semibold ${currentTheme.textSecondary}`}>
                Dostupní řidiči
              </p>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {availableDrivers.length} online
              </span>
            </div>
            
            {availableDrivers.length === 0 ? (
              <div className="text-center py-8 flex-1 flex flex-col justify-center">
                <Users className={`mx-auto mb-3 ${currentTheme.textMuted}`} size={48} />
                <p className={`${currentTheme.textMuted} mb-2`}>Žádní dostupní řidiči online</p>
                <p className="text-sm text-gray-400">Objednávka bude automaticky přidělena, až bude řidič k dispozici</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(90vh - 300px)' }}>
                <div className="space-y-3">
                  {availableDrivers.map(driver => (
                    <button
                      key={driver.id}
                      onClick={() => assignDriver(driver.name)}
                      className={`w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">{driver.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-blue-700">{driver.name}</p>
                              <p className="text-sm text-gray-500">{driver.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Car size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">{driver.car}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              driver.type === 'minivan' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {driver.type === 'minivan' ? 'Minivan' : 'Standard'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all duration-200 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex space-x-3 flex-shrink-0">
            <button 
              onClick={() => setShowAssignModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zrušit
            </button>
            {availableDrivers.length > 0 && (
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                Vyberte řidiče výše
              </button>
            )}
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
      // Parse input like "aug" or "augustine"
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
        autoAssignAt: now + 900000 // 15 minut od teď
      };
      
      setActiveOrders([newOrder, ...activeOrders]);
      setShowQuickOrder(false);
      setQuickInput('');
      setSelectedRoute(null);
    };

    if (!showQuickOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${currentTheme.cardBg} rounded-xl max-w-md w-full p-6 ${currentTheme.shadow}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-bold ${currentTheme.textPrimary}`}>Rychlá objednávka</h3>
            <button onClick={() => setShowQuickOrder(false)}>
              <X className={currentTheme.textMuted} size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`text-sm font-medium ${currentTheme.textSecondary}`}>Zadejte zkratku hotelu</label>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => handleQuickInput(e.target.value)}
                placeholder="aug, hil, 4s..."
                className={`w-full p-3 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary} mt-1`}
              />
              <p className={`text-xs ${currentTheme.textMuted} mt-1`}>
                Příklad: aug = Augustine, hil = Hilton
              </p>
            </div>

            {selectedRoute && (
              <div>
                <h4 className={`font-semibold ${currentTheme.textPrimary} mb-2`}>
                  {selectedRoute.hotel.name}
                </h4>
                <div className="space-y-2">
                  {selectedRoute.routes.map((route, index) => (
                    <button
                      key={index}
                      onClick={() => createOrder(route)}
                      className={`w-full p-3 text-left rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{route.destination}</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{route.price} Kč</div>
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
        <div className={`${currentTheme.cardBg} p-4 rounded-lg ${currentTheme.shadow} border-l-4 ${
          order.status === 'waiting' ? 'border-yellow-400' :
          order.status === 'in_progress' ? 'border-blue-400' :
          'border-green-400'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold ${currentTheme.textPrimary}`}>
                  {order.hotel} → {order.destination}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status === 'waiting' ? 'Čeká na řidiče' : 
                   order.status === 'in_progress' ? 'V průběhu' : 'Dokončeno'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className={currentTheme.textMuted}>Čas objednávky:</p>
                  <p className={currentTheme.textSecondary}>{order.time}</p>
                </div>
                <div>
                  <p className={currentTheme.textMuted}>Řidič:</p>
                  <p className={currentTheme.textSecondary}>
                    {order.driver || 'Nepřidělen'}
                  </p>
                </div>
                <div>
                  <p className={currentTheme.textMuted}>Cena:</p>
                  <p className={`font-semibold text-green-600`}>{order.price} Kč</p>
                </div>
                <div>
                  <p className={currentTheme.textMuted}>Provize:</p>
                  <p className={currentTheme.textSecondary}>{order.commission} Kč</p>
                </div>
              </div>

              {/* Timer for waiting orders */}
              {order.status === 'waiting' && !order.driver && timeRemaining && (
                <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-800">
                      Automatické přidělení za:
                    </span>
                    <span className={`font-mono font-bold text-lg ${
                      timeRemaining.total < 300000 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {String(timeRemaining.minutes).padStart(2, '0')}:
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </span>
                  </div>
                  {timeRemaining.total < 300000 && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ Méně než 5 minut do automatického přidělení!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {order.status === 'waiting' && !order.driver && (
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowAssignModal(true);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Přidělit řidiče
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Zrušit
              </button>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Správa objednávek</h2>
          <button 
            onClick={() => setShowQuickOrder(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nová objednávka</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${currentTheme.cardBg} p-4 rounded-lg ${currentTheme.shadow}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted}`}>Čekající</p>
                <p className={`text-2xl font-bold text-yellow-600`}>{waitingOrders.length}</p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className={`${currentTheme.cardBg} p-4 rounded-lg ${currentTheme.shadow}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted}`}>V průběhu</p>
                <p className={`text-2xl font-bold text-blue-600`}>{inProgressOrders.length}</p>
              </div>
              <Route className="text-blue-600" size={24} />
            </div>
          </div>
          <div className={`${currentTheme.cardBg} p-4 rounded-lg ${currentTheme.shadow}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted}`}>Dokončené</p>
                <p className={`text-2xl font-bold text-green-600`}>{completedOrders.length}</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Waiting Orders - Priority */}
        {waitingOrders.length > 0 && (
          <div>
            <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4 text-yellow-600`}>
              🕐 Čekající objednávky ({waitingOrders.length})
            </h3>
            <div className="space-y-4">
              {waitingOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* In Progress Orders */}
        {inProgressOrders.length > 0 && (
          <div>
            <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4 text-blue-600`}>
              🚗 Objednávky v průběhu ({inProgressOrders.length})
            </h3>
            <div className="space-y-4">
              {inProgressOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div>
            <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4 text-green-600`}>
              ✅ Dokončené objednávky ({completedOrders.length})
            </h3>
            <div className="space-y-4">
              {completedOrders.slice(0, 5).map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {completedOrders.length > 5 && (
              <button className="w-full p-3 text-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400">
                Zobrazit dalších {completedOrders.length - 5} objednávek
              </button>
            )}
          </div>
        )}

        {activeOrders.length === 0 && (
          <div className={`${currentTheme.cardBg} p-8 rounded-xl ${currentTheme.shadow} text-center`}>
            <Route className={`mx-auto mb-4 ${currentTheme.textMuted}`} size={48} />
            <h3 className={`text-lg font-semibold ${currentTheme.textPrimary} mb-2`}>
              Žádné objednávky
            </h3>
            <p className={`${currentTheme.textMuted} mb-4`}>
              Zatím nejsou žádné aktivní objednávky.
            </p>
            <button 
              onClick={() => setShowQuickOrder(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Online řidiči', value: drivers.filter(d => d.status === 'online').length, icon: Users, color: 'green' },
          { label: 'Aktivní jízdy', value: activeOrders.filter(o => o.status === 'in_progress').length, icon: Route, color: 'blue' },
          { label: 'Čekající objednávky', value: activeOrders.filter(o => o.status === 'waiting').length, icon: Clock, color: 'yellow' },
          { label: 'Dnes ukončeno', value: activeOrders.filter(o => o.status === 'completed').length, icon: CheckCircle, color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className={`${currentTheme.cardBg} p-6 rounded-xl ${currentTheme.shadow}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textMuted}`}>{stat.label}</p>
                <p className={`text-3xl font-bold ${currentTheme.textPrimary} mt-1`}>{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`${currentTheme.cardBg} p-6 rounded-xl ${currentTheme.shadow}`}>
        <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4`}>Rychlé akce</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowQuickOrder(true)}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center"
          >
            <Plus size={24} className="mb-2" />
            <span className="text-sm font-medium">Nová objednávka</span>
          </button>
          <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center">
            <UserCheck size={24} className="mb-2" />
            <span className="text-sm font-medium">Schválit řidiče</span>
          </button>
          <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex flex-col items-center">
            <MessageSquare size={24} className="mb-2" />
            <span className="text-sm font-medium">Poslat zprávu</span>
          </button>
          <button className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex flex-col items-center">
            <BarChart3 size={24} className="mb-2" />
            <span className="text-sm font-medium">Statistiky</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`${currentTheme.cardBg} p-6 rounded-xl ${currentTheme.shadow}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold ${currentTheme.textPrimary}`}>Aktuální objednávky</h3>
          <button 
            onClick={() => setCurrentScreen('orders')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Zobrazit vše
          </button>
        </div>
        <div className="space-y-3">
          {activeOrders.slice(0, 5).map(order => (
            <div key={order.id} className={`p-4 border rounded-lg ${currentTheme.border} ${currentTheme.hover}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-semibold ${currentTheme.textPrimary}`}>
                    {order.hotel} → {order.destination}
                  </p>
                  <p className={`text-sm ${currentTheme.textSecondary}`}>
                    {order.driver ? `Řidič: ${order.driver}` : 'Čeká na řidiče'} • {order.time}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
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
  const DriversScreen = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Správa řidičů</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className={`absolute left-3 top-3 ${currentTheme.textMuted}`} size={20} />
            <input
              type="text"
              placeholder="Hledat řidiče..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary}`}
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Pending Approvals */}
      {drivers.some(d => !d.approved) && (
        <div className={`${currentTheme.cardBg} p-6 rounded-xl ${currentTheme.shadow}`}>
          <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4 text-orange-600`}>
            Čekající schválení ({drivers.filter(d => !d.approved).length})
          </h3>
          <div className="space-y-3">
            {drivers.filter(d => !d.approved).map(driver => (
              <div key={driver.id} className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-semibold">{driver.name}</p>
                  <p className="text-sm text-gray-600">{driver.phone} • {driver.car}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setDrivers(drivers.map(d => d.id === driver.id ? {...d, approved: true} : d));
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Schválit
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Odmítnout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drivers List */}
      <div className={`${currentTheme.cardBg} rounded-xl ${currentTheme.shadow} overflow-hidden`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-bold ${currentTheme.textPrimary}`}>Všichni řidiči</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Online ({drivers.filter(d => d.status === 'online').length})
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                Celkem ({drivers.length})
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${currentTheme.bg}`}>
              <tr>
                <th className={`text-left p-4 ${currentTheme.textSecondary} font-medium`}>Řidič</th>
                <th className={`text-left p-4 ${currentTheme.textSecondary} font-medium`}>Vozidlo</th>
                <th className={`text-left p-4 ${currentTheme.textSecondary} font-medium`}>Status</th>
                <th className={`text-left p-4 ${currentTheme.textSecondary} font-medium`}>Typ</th>
                <th className={`text-left p-4 ${currentTheme.textSecondary} font-medium`}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {drivers.filter(d => d.approved).map(driver => (
                <tr key={driver.id} className={`border-t ${currentTheme.border} ${currentTheme.hover}`}>
                  <td className="p-4">
                    <div>
                      <p className={`font-semibold ${currentTheme.textPrimary}`}>{driver.name}</p>
                      <p className={`text-sm ${currentTheme.textSecondary}`}>{driver.phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className={`${currentTheme.textPrimary}`}>{driver.car}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      driver.status === 'online' ? 'bg-green-100 text-green-800' :
                      driver.status === 'busy' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.status === 'online' ? 'Online' : 
                       driver.status === 'busy' ? 'Zaneprázdněn' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      driver.type === 'minivan' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {driver.type === 'minivan' ? 'Minivan' : 'Standard'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-orange-600 hover:bg-orange-100 rounded">
                        <Ban size={16} />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded">
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

  // Settings Screen  
  const SettingsScreen = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Nastavení systému</h2>
      
      {/* Commission Settings */}
      <div className={`${currentTheme.cardBg} p-6 rounded-xl ${currentTheme.shadow}`}>
        <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4`}>Nastavení provizí</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
              Provize hotelu (%)
            </label>
            <input 
              type="number" 
              defaultValue="15"
              className={`w-full p-3 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
              Provize řidiče (%)
            </label>
            <input 
              type="number" 
              defaultValue="75"
              className={`w-full p-3 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
              Provize administrátora (%)
            </label>
            <input 
              type="number" 
              defaultValue="10"
              className={`w-full p-3 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
              Dodatečná provize (%)
            </label>
            <input 
              type="number" 
              defaultValue="0"
              className={`w-full p-3 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary}`}
            />
          </div>
        </div>
      </div>

      {/* Timing Settings */}
      <div className={`${currentTheme.cardBg} p-6 rounded-xl ${currentTheme.shadow}`}>
        <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4`}>Časové nastavení</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
              Doba pro přijetí objednávky (sekundy)
            </label>
            <input 
              type="number" 
              defaultValue="15"
              className={`w-full p-3 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
              Prioritní doba pro VIP řidiče (sekundy)
            </label>
            <input 
              type="number" 
              defaultValue="15"
              className={`w-full p-3 rounded-lg border ${currentTheme.input} ${currentTheme.textPrimary}`}
            />
          </div>
        </div>
      </div>

      {/* Driver Priority */}
      <div className={`${currentTheme.cardBg} p-6 rounded-xl ${currentTheme.shadow}`}>
        <h3 className={`text-lg font-bold ${currentTheme.textPrimary} mb-4`}>Pořadí řidičů</h3>
        <p className={`text-sm ${currentTheme.textSecondary} mb-4`}>
          Určete, v jakém pořadí se budou objednávky nabízet řidičům
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>VIP řidiči (prvních 15 sekund)</span>
            <button className="text-blue-600 hover:text-blue-700">
              <Edit size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Standardní řidiči</span>
            <button className="text-blue-600 hover:text-blue-700">
              <Edit size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Zrušit
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Uložit změny
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-200`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 ${currentTheme.sidebarBg} ${currentTheme.shadow} transform transition-transform duration-200 z-30 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-xl font-bold ${currentTheme.textPrimary}`}>Taxi Admin</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className={currentTheme.textMuted} size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentScreen(item.id);
                  // Schovat menu na mobile po výběru - používáme matchMedia pro lepší kompatibilitu
                  if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentScreen === item.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : `${currentTheme.textSecondary} ${currentTheme.hover}`
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className={`${currentTheme.cardBg} ${currentTheme.shadow} px-6 py-4 flex justify-between items-center`}>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className=""
            >
              <Menu className={currentTheme.textMuted} size={20} />
            </button>
            <h2 className={`text-lg font-semibold ${currentTheme.textPrimary} capitalize`}>
              {menuItems.find(item => item.id === currentScreen)?.label}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className={currentTheme.textMuted} size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className={currentTheme.textMuted} size={20} /> : <Moon className={currentTheme.textMuted} size={20} />}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <span className={`text-sm font-medium ${currentTheme.textPrimary}`}>Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {currentScreen === 'dashboard' && <DashboardScreen />}
          {currentScreen === 'drivers' && <DriversScreen />}
          {currentScreen === 'orders' && <OrdersScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
          {/* Add other screens here */}
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
