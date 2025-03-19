import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PropertyCard } from '../../components/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Test Property',
    description: 'A test property description',
    price: 1000,
    address: '123 Test St',
    location: 'Test Location',
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 1000,
    images: ['https://example.com/image.jpg'],
    amenities: ['WiFi', 'Parking'],
    landlord_name: 'Test Landlord',
    landlord_email: 'test@example.com',
    landlord_phone: '123-456-7890',
    is_furnished: false,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  };

  it('renders property information correctly', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.description)).toBeInTheDocument();
    expect(screen.getByText(`${mockProperty.bedrooms} beds`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProperty.bathrooms} baths`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProperty.square_feet} sq ft`)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.location)).toBeInTheDocument();
  });

  it('renders the correct image', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    const image = screen.getByAltText(mockProperty.title) as HTMLImageElement;
    expect(image.src).toBe(mockProperty.images[0]);
  });

  it('renders fallback image when no images are provided', () => {
    const propertyWithoutImages = { ...mockProperty, images: [] };
    render(
      <BrowserRouter>
        <PropertyCard property={propertyWithoutImages} />
      </BrowserRouter>
    );

    const image = screen.getByAltText(mockProperty.title) as HTMLImageElement;
    expect(image.src).toContain('unsplash.com');
  });

  it('formats price correctly', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('renders view details link with correct URL', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    const link = screen.getByText('View Details');
    expect(link).toHaveAttribute('href', `/properties/${mockProperty.id}`);
  });
});