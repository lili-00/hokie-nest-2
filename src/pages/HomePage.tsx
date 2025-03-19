import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Users } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from '../components/PropertyCard';

export function HomePage() {
  const { properties, loading, error } = useProperties({ limit: 6 });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"
            alt="Virginia Tech Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center h-full text-white">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Perfect Home Near Virginia Tech
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Discover comfortable and convenient housing options for students and faculty
              in the heart of Blacksburg.
            </p>
            <div className="flex gap-4">
              <Link
                to="/properties"
                className="bg-secondary hover:bg-secondary-hover px-8 py-3 rounded-md text-lg font-semibold transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                to="/contact"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-semibold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Hokie Nest?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Prime Locations</h3>
              <p className="text-gray-600">
                Find properties within walking distance to campus and popular amenities
              </p>
            </div>
            
            <div className="text-center p-6">
              <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Housing</h3>
              <p className="text-gray-600">
                Verified properties meeting our high standards of comfort and safety
              </p>
            </div>
            
            <div className="text-center p-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Student Community</h3>
              <p className="text-gray-600">
                Connect with fellow Hokies in our vibrant housing communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link
              to="/properties"
              className="text-secondary hover:text-secondary-hover font-semibold transition-colors"
            >
              View All Properties →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Error loading properties. Please try again later.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your New Home?
          </h2>
          <p className="text-xl mb-8">
            Start your search now and discover the perfect place near Virginia Tech
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-semibold transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Properties
          </Link>
        </div>
      </section>
    </div>
  );
}