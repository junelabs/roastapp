'use client';

import Image from 'next/image';

export default function RoasterCard({ roaster, onClick }) {
  const {
    name,
    location,
    imageUrl,
    featured,
    top100,
    rating,
    ratingCount,
    country,
    likes,
    countryFlag = '🇺🇸',
  } = roaster;

  const renderStars = (value) => {
    if (typeof value !== 'number') return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const diff = value - i;
      const full = diff >= 0;
      const half = !full && value >= i - 0.75 && value < i - 0.25; // 0.25..0.75 window
      if (full) {
        stars.push(
          <svg key={`full-${i}`} className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z" />
          </svg>
        );
      } else if (half) {
        stars.push(
          <svg key={`half-${i}`} className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <clipPath id={`half-${i}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z" className="fill-gray-300" />
            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z" className="fill-current" clipPath={`url(#half-${i})`} />
          </svg>
        );
      } else {
        stars.push(
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div
      onClick={onClick}
      className="min-w-[320px] max-w-[420px] w-full h-[320px] bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
    >
      <div className="relative">
        {featured && (
          <span className="absolute top-3 left-3 bg-gray-50 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow z-10">
            ✨ Featured
          </span>
        )}
        {top100 && (
          <span className="absolute top-3 right-3 bg-gray-50 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow z-10">
            🌍 Top 100 Roaster
          </span>
        )}

        <div className="relative w-full h-60 bg-white">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          ) : null}
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 rounded-b-2xl">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-semibold text-sm">{name}</h2>
          <span className="text-sm text-gray-700 text-right">
            {location}{location && country ? ', ' : ''}{country}
          </span>
        </div>

        {ratingCount > 0 && typeof rating === 'number' ? (
          <div className="flex items-center text-sm mt-1 gap-1">
            <span className="text-gray-700 font-medium tabular-nums">{Number(rating).toFixed(2)}</span>
            <div className="flex items-center" aria-label={`Average ${Number(rating).toFixed(2)} from ${ratingCount} reviews`}>
              {renderStars(Number(rating))}
            </div>
            <span className="text-gray-500 text-xs">({ratingCount})</span>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic mt-1">Not yet rated</div>
        )}
      </div>
    </div>
  );
}
