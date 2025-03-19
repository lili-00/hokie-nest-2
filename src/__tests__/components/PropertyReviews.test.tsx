import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertyReviews } from '../../components/PropertyReviews';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('PropertyReviews', () => {
  const mockReviews = [
    {
      id: '1',
      property_id: 'prop1',
      user_id: 'user1',
      rating: 5,
      comment: 'Great property!',
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user1', email: 'test@example.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    });
  });

  it('renders reviews correctly', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockReviews, error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null }))
    } as any));

    render(<PropertyReviews propertyId="prop1" />);

    await waitFor(() => {
      expect(screen.getByText('Great property!')).toBeInTheDocument();
    });
  });

  it('handles review submission', async () => {
    const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockReviews, error: null }))
        }))
      })),
      insert: mockInsert
    } as any));

    render(<PropertyReviews propertyId="prop1" />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Share your experience...'), {
        target: { value: 'New review' }
      });

      fireEvent.click(screen.getByText('Submit Review'));
    });

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([{
        property_id: 'prop1',
        user_id: 'user1',
        rating: 5,
        comment: 'New review'
      }]);
      expect(toast.success).toHaveBeenCalledWith('Review submitted successfully!');
    });
  });

  it('displays error message when reviews fail to load', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: null, 
            error: { message: 'Failed to load' } 
          }))
        }))
      }))
    } as any));

    render(<PropertyReviews propertyId="prop1" />);

    await waitFor(() => {
      expect(screen.getByText('No reviews yet. Be the first to review!')).toBeInTheDocument();
    });
  });

  it('calculates average rating correctly', async () => {
    const mockReviewsWithDifferentRatings = [
      { ...mockReviews[0], rating: 5 },
      { ...mockReviews[0], id: '2', rating: 3 }
    ];

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockReviewsWithDifferentRatings, error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null }))
    } as any));

    render(<PropertyReviews propertyId="prop1" />);

    await waitFor(() => {
      expect(screen.getByText('4.0')).toBeInTheDocument();
    });
  });

  it('requires authentication to submit review', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    });

    render(<PropertyReviews propertyId="prop1" />);

    await act(async () => {
      fireEvent.click(screen.getByText('Submit Review'));
    });

    expect(screen.getByText('Please log in to leave a review')).toBeInTheDocument();
  });

  it('handles star rating selection', async () => {
    render(<PropertyReviews propertyId="prop1" />);

    const stars = screen.getAllByRole('button').filter(button => 
      button.className.includes('focus:outline-none')
    );

    await act(async () => {
      fireEvent.click(stars[2]); // Click the third star (rating: 3)
    });

    // Submit the review and verify the rating
    const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockReviews, error: null }))
        }))
      })),
      insert: mockInsert
    } as any));

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Share your experience...'), {
        target: { value: 'Test review' }
      });
      fireEvent.click(screen.getByText('Submit Review'));
    });

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([{
        property_id: 'prop1',
        user_id: 'user1',
        rating: 3,
        comment: 'Test review'
      }]);
    });
  });

  it('validates required fields for review submission', async () => {
    render(<PropertyReviews propertyId="prop1" />);

    await act(async () => {
      fireEvent.click(screen.getByText('Submit Review'));
    });

    expect(screen.getByPlaceholderText('Share your experience...')).toBeInvalid();
  });
});