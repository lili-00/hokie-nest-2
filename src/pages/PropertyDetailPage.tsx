import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Square, DollarSign, MapPin, Phone, Mail, Check } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { ContactForm } from '../components/ContactForm';
import { PropertyReviews } from '../components/PropertyReviews';

export function PropertyDetailPage() {
  const { id } = useParams();
  const { properties, loading, error } = useProperties();
  const property = properties.find(p => p.id === id);
  const [showContactForm, setShowContactForm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error loading property' : 'Property not found'}
          </h2>
          <Link
            to="/properties"
            className="inline-flex items-center text-secondary hover:text-secondary-hover"
          >
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/properties"
        className="inline-flex items-center text-secondary hover:text-secondary-hover mb-8"
      >
        ← Back to Properties
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={property.images[0] || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80'}
              alt={property.title}
              className="w-full h-[400px] object-cover"
            />
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-2">
                {property.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} - Image ${index + 2}`}
                    className="h-24 w-full object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="text-2xl font-bold text-primary flex items-center">
                <DollarSign className="w-6 h-6" />
                {property.price.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              {property.address}
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div className="flex items-center">
                <Bed className="w-5 h-5 mr-2 text-gray-600" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-2 text-gray-600" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center">
                <Square className="w-5 h-5 mr-2 text-gray-600" />
                <span>{property.square_feet} sq ft</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </div>

            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 mr-2 text-secondary" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <PropertyReviews propertyId={property.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Landlord */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Landlord</h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                  {property.landlord_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{property.landlord_name}</p>
                  <p className="text-sm">Property Manager</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <a href={`tel:${property.landlord_phone}`} className="hover:text-secondary">
                  {property.landlord_phone}
                </a>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                <a href={`mailto:${property.landlord_email}`} className="hover:text-secondary">
                  {property.landlord_email}
                </a>
              </div>

              <button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-secondary hover:bg-secondary-hover text-white py-3 px-4 rounded-md transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Property Features</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Furnished</span>
                <span>{property.is_furnished ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Location</span>
                <span>{property.location}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Available From</span>
                <span>Immediately</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactForm && (
        <ContactForm
          property={property}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
}