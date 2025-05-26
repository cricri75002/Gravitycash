import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Location {
  id: number;
  name: string;
  address: string;
  distance: number;
  type: 'atm' | 'bank' | 'partner';
  services: string[];
  rating: number;
  isFavorite: boolean;
}

// Mock data for locations
const mockLocations: Location[] = [
  {
    id: 1,
    name: 'CityBank ATM',
    address: '123 Main Street, New York, NY 10001',
    distance: 0.3,
    type: 'atm',
    services: ['Cash Withdrawal', '24/7 Access', 'Deposit'],
    rating: 4.5,
    isFavorite: true,
  },
  {
    id: 2,
    name: 'Global Bank Branch',
    address: '456 Park Avenue, New York, NY 10022',
    distance: 0.7,
    type: 'bank',
    services: ['Cash Withdrawal', 'Currency Exchange', 'Loans', 'Customer Service'],
    rating: 4.2,
    isFavorite: false,
  },
  {
    id: 3,
    name: 'QuickCash Partner',
    address: '789 Broadway, New York, NY 10003',
    distance: 1.2,
    type: 'partner',
    services: ['Cash Withdrawal', 'Mobile Top-Up'],
    rating: 3.8,
    isFavorite: false,
  },
  {
    id: 4,
    name: 'Metro ATM',
    address: '321 5th Avenue, New York, NY 10016',
    distance: 1.5,
    type: 'atm',
    services: ['Cash Withdrawal', '24/7 Access'],
    rating: 4.0,
    isFavorite: true,
  },
  {
    id: 5,
    name: 'EuroBank Branch',
    address: '654 Madison Avenue, New York, NY 10065',
    distance: 2.1,
    type: 'bank',
    services: ['Cash Withdrawal', 'Currency Exchange', 'Loans', 'Safe Deposit Box'],
    rating: 4.7,
    isFavorite: false,
  },
];

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter locations based on search term and type
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || location.type === filterType;
    return matchesSearch && matchesType;
  });

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (id: number) => {
    setLocations(prevLocations => 
      prevLocations.map(location => 
        location.id === id 
          ? { ...location, isFavorite: !location.isFavorite } 
          : location
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Find Withdrawal Locations
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Search and list */}
        <div className="lg:w-1/3 space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search locations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <Button 
              variant={filterType === 'all' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button 
              variant={filterType === 'atm' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('atm')}
            >
              ATMs
            </Button>
            <Button 
              variant={filterType === 'bank' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('bank')}
            >
              Banks
            </Button>
            <Button 
              variant={filterType === 'partner' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setFilterType('partner')}
            >
              Partners
            </Button>
          </div>

          {/* Locations list */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredLocations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No locations found matching your criteria
              </p>
            ) : (
              filteredLocations.map(location => (
                <Card 
                  key={location.id} 
                  className="p-4 hover:shadow-md transition-shadow duration-200"
                  hoverable
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{location.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{location.address}</p>
                      <div className="flex items-center mt-2">
                        <div className={`
                          px-2 py-0.5 rounded-full text-xs 
                          ${location.type === 'atm' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' : 
                            location.type === 'bank' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : 
                            'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300'}
                        `}>
                          {location.type === 'atm' ? 'ATM' : location.type === 'bank' ? 'Bank' : 'Partner'}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {location.distance} km away
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(location.id)}
                      className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors"
                    >
                      <Star 
                        className={`h-5 w-5 ${location.isFavorite ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300' : ''}`} 
                      />
                    </button>
                  </div>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right side - Map */}
        <div className="lg:w-2/3">
          <Card className="p-0 overflow-hidden h-[600px] relative">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="h-full">
                {/* This would be a real map in a production app */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/16013361/pexels-photo-16013361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200')" }}>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                
                {/* Map markers */}
                {filteredLocations.map(location => (
                  <div 
                    key={location.id}
                    className="absolute"
                    style={{ 
                      left: `${Math.random() * 80 + 10}%`, 
                      top: `${Math.random() * 80 + 10}%` 
                    }}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center animate-pulse
                      ${location.type === 'atm' ? 'bg-indigo-500' : location.type === 'bank' ? 'bg-purple-500' : 'bg-teal-500'}
                    `}>
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute mt-1 transform -translate-x-1/2 left-1/2">
                      <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-md text-xs whitespace-nowrap">
                        {location.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;