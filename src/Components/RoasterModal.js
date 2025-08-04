'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function RoasterModal({ roaster, onClose }) {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [avgRating, setAvgRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);

  const {
    name,
    location,
    imageUrl,
    description,
    roastStyle,
    roastVolume,
    founded,
    cafes,
    certifications,
    coffees,
    website,
    _id,
  } = roaster || {};

  useEffect(() => {
    if (!_id) return;

    const fetchAvgRating = async () => {
      const { data, error } = await supabase
        .from('roaster_ratings')
        .select('rating')
        .eq('roaster_id', _id);

      if (!error && data?.length) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / data.length;
        setAvgRating(Math.round(avg * 100) / 100);
        setRatingCount(data.length);
      }
    };

    fetchAvgRating();
  }, [_id, submitted]);

  const handleRatingSubmit = async () => {
    if (!rating) return;
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      alert('You must be logged in to submit a rating.');
      setLoading(false);
      return;
    }

    const userId = user.id;

    const { data: recentRatings, error: fetchError } = await supabase
      .from('roaster_ratings')
      .select('*')
      .eq('user_id', userId)
      .eq('roaster_id', _id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (fetchError || recentRatings.length > 0) {
      alert('You already rated this roaster in the past 24 hours.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('roaster_ratings').insert([
      {
        roaster_id: _id,
        rating,
        user_id: userId,
      },
    ]);

    setLoading(false);
    if (insertError) {
      console.error('Error submitting rating:', insertError);
    } else {
      setSubmitted(true);
      setRating(null);
    }
  };

  if (!roaster) return null;

  return (
    <Transition.Root show={!!roaster} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl mx-auto transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="p-6 md:p-10 lg:p-12">
                  <div className="flex justify-between flex-wrap gap-6">
                    <div className="flex gap-4 min-w-[280px]">
                      {imageUrl && (
                        <div className="h-24 w-24 rounded-lg overflow-hidden border bg-white relative">
                          <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      )}
                      <div>
                        <Dialog.Title className="text-2xl font-bold mb-1">{name}</Dialog.Title>
                        <p className="text-sm text-gray-600">{location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-auto">
                      <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl font-bold mb-2"
                      >
                        ×
                      </button>
                      {ratingCount > 0 && (
                        <div className="text-sm text-yellow-600 font-medium">
                          ⭐ {avgRating.toFixed(1)} ({ratingCount} ratings)
                        </div>
                      )}
                    </div>
                  </div>

                  {description && (
                    <div className="mt-8">
                      <h3 className="text-md font-semibold mb-2">About</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                    </div>
                  )}

                  <div className="mt-8">
                    <h3 className="text-md font-semibold mb-2">Cafés</h3>
                    <p className="text-sm text-gray-700">{cafes || 'N/A'}</p>
                  </div>

                  <div className="pt-8 border-t mt-8">
                    <h3 className="text-md font-semibold mb-2">Rate this roaster</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setRating(num)}
                          className="text-2xl focus:outline-none"
                        >
                          <span className={rating >= num ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleRatingSubmit}
                      disabled={loading || !rating}
                      className="mt-3 bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    {submitted && (
                      <p className="mt-2 text-green-600 text-sm">Thanks for your rating!</p>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
