import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactForm } from '../../components/ContactForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn()
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

describe('ContactForm', () => {
  const mockProperty = {
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
  };

  const mockUser = {
    id: 'user1',
    email: 'test@example.com'
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    });
  });

  it('renders form fields correctly', () => {
    render(<ContactForm property={mockProperty} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
    vi.mocked(supabase.from).mockImplementation(() => ({
      insert: mockInsert
    } as any));

    render(<ContactForm property={mockProperty} onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test message' } });

      fireEvent.click(screen.getByText('Send Message'));
    });

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([{
        property_id: mockProperty.id,
        user_id: mockUser.id,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        message: 'Test message'
      }]);
      expect(toast.success).toHaveBeenCalledWith('Message sent successfully!');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles form submission error', async () => {
    const mockError = { message: 'Failed to send message' };
    vi.mocked(supabase.from).mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: mockError })
    } as any));

    render(<ContactForm property={mockProperty} onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '123-456-7890' } });
      fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test message' } });

      fireEvent.click(screen.getByText('Send Message'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to send message. Please try again.');
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('requires user authentication', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    });

    render(<ContactForm property={mockProperty} onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Send Message'));
    });

    expect(toast.error).toHaveBeenCalledWith('Please log in to send a message');
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('closes form when cancel button is clicked', async () => {
    render(<ContactForm property={mockProperty} onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    render(<ContactForm property={mockProperty} onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Send Message'));
    });

    expect(screen.getByLabelText(/Name/i)).toBeInvalid();
    expect(screen.getByLabelText(/Email/i)).toBeInvalid();
    expect(screen.getByLabelText(/Phone/i)).toBeInvalid();
    expect(screen.getByLabelText(/Message/i)).toBeInvalid();
  });

  it('validates email format', async () => {
    render(<ContactForm property={mockProperty} onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
      fireEvent.click(screen.getByText('Send Message'));
    });

    expect(screen.getByLabelText(/Email/i)).toBeInvalid();
  });
});