import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProperties } from '../../hooks/useProperties';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            or: vi.fn(),
            gte: vi.fn(),
            lte: vi.fn(),
            eq: vi.fn(),
            ilike: vi.fn(),
            then: vi.fn()
          }))
        }))
      }))
    }))
  }
}));

describe('useProperties', () => {
  const mockProperties = [
    {
      id: '1',
      title: 'Test Property',
      description: 'A test property',
      price: 1000,
      address: '123 Test St',
      location: 'Test Location',
      bedrooms: 2,
      bathrooms: 1,
      square_feet: 1000,
      images: [],
      amenities: [],
      landlord_name: 'Test Landlord',
      landlord_email: 'test@example.com',
      landlord_phone: '123-456-7890',
      is_furnished: false,
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch properties with no filters', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: mockProperties, error: null });
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: mockSelect,
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn()
    } as any));

    const { result } = renderHook(() => useProperties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.properties).toEqual(mockProperties);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch');
    const mockSelect = vi.fn().mockResolvedValue({ data: null, error: mockError });
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: mockSelect,
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn()
    } as any));

    const { result } = renderHook(() => useProperties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.properties).toEqual([]);
  });

  it('should apply filters correctly', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: mockProperties, error: null });
    const mockOrder = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockReturnThis();
    const mockGte = vi.fn().mockReturnThis();
    const mockLte = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockOr = vi.fn().mockReturnThis();
    const mockIlike = vi.fn().mockReturnThis();

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: mockSelect,
      order: mockOrder,
      limit: mockLimit,
      gte: mockGte,
      lte: mockLte,
      eq: mockEq,
      or: mockOr,
      ilike: mockIlike,
      then: vi.fn()
    } as any));

    const filters = {
      minPrice: 1000,
      maxPrice: 2000,
      bedrooms: 2,
      bathrooms: 1,
      searchTerm: 'test',
      isFurnished: true,
      location: 'Test Location'
    };

    renderHook(() => useProperties({ filters }));

    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockGte).toHaveBeenCalledWith('price', 1000);
      expect(mockLte).toHaveBeenCalledWith('price', 2000);
      expect(mockEq).toHaveBeenCalledWith('bedrooms', 2);
      expect(mockEq).toHaveBeenCalledWith('bathrooms', 1);
      expect(mockEq).toHaveBeenCalledWith('is_furnished', true);
      expect(mockIlike).toHaveBeenCalledWith('location', '%Test Location%');
    });
  });

  it('should handle limit option', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: mockProperties, error: null });
    const mockLimit = vi.fn().mockReturnThis();

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: mockSelect,
      order: vi.fn().mockReturnThis(),
      limit: mockLimit,
      then: vi.fn()
    } as any));

    renderHook(() => useProperties({ limit: 5 }));

    await waitFor(() => {
      expect(mockLimit).toHaveBeenCalledWith(5);
    });
  });

  it('should update properties when filters change', async () => {
    const mockSelect = vi.fn()
      .mockResolvedValueOnce({ data: mockProperties, error: null })
      .mockResolvedValueOnce({ data: [{ ...mockProperties[0], id: '2' }], error: null });

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: mockSelect,
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      then: vi.fn()
    } as any));

    const { result, rerender } = renderHook(
      (props) => useProperties(props),
      { initialProps: { filters: { bedrooms: 2 } } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.properties).toEqual(mockProperties);

    // Change filters
    rerender({ filters: { bedrooms: 3 } });

    await waitFor(() => {
      expect(result.current.properties).toEqual([{ ...mockProperties[0], id: '2' }]);
    });
  });
});