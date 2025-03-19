import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MessageSquare, Star } from 'lucide-react';
import type { ContactInquiry, PropertyReview, Property } from '../types';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<(ContactInquiry & { property: Property })[]>([]);
  const [reviews, setReviews] = useState<(PropertyReview & { property: Property })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchUserData() {
      try {
        const [inquiriesResponse, reviewsResponse] = await Promise.all([
          supabase
            .from('contact_inquiries')
            .select('*, property:properties(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('property_reviews')
            .select('*, property:properties(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        if (inquiriesResponse.error) throw inquiriesResponse.error;
        if (reviewsResponse.error) throw reviewsResponse.error;

        setInquiries(inquiriesResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your data');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">{user?.email}</p>
        </div>

        {/* Contact Inquiries */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">My Inquiries</h2>
          </div>
          
          {inquiries.length === 0 ? (
            <p className="text-gray-500">You haven't made any inquiries yet.</p>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{inquiry.property.title}</h3>
                      <p className="text-gray-600">{inquiry.property.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      inquiry.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{inquiry.message}</p>
                  <div className="text-sm text-gray-500">
                    Sent on {new Date(inquiry.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Reviews */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">My Reviews</h2>
          </div>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500">You haven't written any reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{review.property.title}</h3>
                    <p className="text-gray-600">{review.property.location}</p>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    Posted on {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}