export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  images: string[];
  amenities: string[];
  landlord_name: string;
  landlord_email: string;
  landlord_phone: string;
  is_furnished: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  id: string;
  property_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface PropertyReview {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}