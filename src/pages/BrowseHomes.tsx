import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
interface Listing {
  id: string;
  location: string;
  start_date: string;
  end_date: string;
  requirements: string;
  price: number;
  image_url: string;
  is_booked: boolean;
  user_id: string;
}

interface BookingModalProps {
  listing: Listing;
  onClose: () => void;
  onBook: (startDate: Date, endDate: Date) => Promise<void>;
}

function BookingModal({ listing, onClose, onBook }: BookingModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false); // Track payment step
  const [paymentProcessing, setPaymentProcessing] = useState(false); // Simulate payment processing

  // Calculate the number of nights and total price
  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return nights * listing.price;
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      toast.error('End date must be after start date');
      return;
    }

    // Move to payment step
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    try {
      // Simulate payment processing with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay to mimic payment processing

      // Proceed with booking after "payment"
      await onBook(startDate!, endDate!);
      toast.success('Payment Successful! Booking Confirmed.');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Book {listing.location}</h2>

        {!showPayment ? (
          // Date selection step
          <form onSubmit={handleDateSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Check-in Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                minDate={new Date(listing.start_date)}
                maxDate={new Date(listing.end_date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select check-in date"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Check-out Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                minDate={startDate || new Date(listing.start_date)}
                maxDate={new Date(listing.end_date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select check-out date"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        ) : (
          // Payment step
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="mb-4">
              <p className="text-gray-700">
                <span className="font-bold">Location:</span> {listing.location}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Check-in:</span> {startDate?.toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Check-out:</span> {endDate?.toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Total Price:</span> ${calculateTotalPrice().toFixed(2)}
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowPayment(false)} // Go back to date selection
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePayment}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? 'Processing Payment...' : 'Pay Now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseHomes() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_booked', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (startDate: Date, endDate: Date) => {
    if (!user || !selectedListing) return;

    try {
      const { error: bookingError } = await supabase.from('bookings').insert({
        listing_id: selectedListing.id,
        user_id: user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'confirmed',
      });

      if (bookingError) throw bookingError;

      const { error: listingError } = await supabase
        .from('listings')
        .update({ is_booked: true })
        .eq('id', selectedListing.id);

      if (listingError) throw listingError;

      toast.success('Booking confirmed successfully!');
      fetchListings();
    } catch (error) {
      console.error('Error booking:', error);
      toast.error('Failed to book. Please try again.');
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Homes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by location..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              className="w-full"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No homes available matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={listing.image_url}
                alt={`Home in ${listing.location}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{listing.location}</h2>
                <p className="text-gray-600 mb-2">${listing.price} per night</p>
                <p className="text-gray-600 mb-4">{listing.requirements}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(listing.start_date).toLocaleDateString()} -{' '}
                    {new Date(listing.end_date).toLocaleDateString()}
                  </span>
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    onClick={() => (user ? setSelectedListing(listing) : toast.error('Please login to book'))}
                    disabled={listing.is_booked}
                  >
                    {listing.is_booked ? 'Booked' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedListing && (
        <BookingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onBook={handleBook}
        />
      )}
    </div>
  );
}