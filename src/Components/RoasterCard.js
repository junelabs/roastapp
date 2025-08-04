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
    countryFlag = "🇺🇸",
  } = roaster;

  // Helper to generate star icons
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 fill-yellow-500" viewBox="0 0 24 24">
          <path d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4" viewBox="0 0 24 24">
          <path
            d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z"
            className="fill-gray-300"
          />
          <defs>
            <clipPath id="leftHalf">
              <rect x="0" y="0" width="12" height="24" />
            </clipPath>
          </defs>
          <path
            d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z"
            className="fill-yellow-500"
            clipPath="url(#leftHalf)"
          />
        </svg>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300" viewBox="0 0 24 24">
          <path d="M12 .587l3.668 7.568L24 9.75l-6 5.888L19.416 24 12 19.812 4.584 24 6 15.638 0 9.75l8.332-1.595z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
    >
      <div className="relative p-4">
        {featured && (
          <span className="absolute top-3 left-3 bg-gray-50 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow">
            ✨ Featured
          </span>
        )}
        {top100 && (
          <span className="absolute top-3 right-3 bg-gray-50 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow">
            🌍 Top 100 Roaster
          </span>
        )}

        <img
          src={imageUrl}
          alt={name}
          className="w-full object-contain h-48 mx-auto"
        />
      </div>

      <div className="bg-gray-50 px-4 py-3 rounded-b-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-sm">{name}</h2>
          <span className="text-sm text-gray-700">
            {location}{location && country ? ',' : ''} {country}
          </span>
        </div>

        {ratingCount > 0 && typeof rating === "number" ? (
          <div className="flex items-center text-sm mt-1 gap-1">
            <span className="text-gray-700 font-medium">{rating.toFixed(1)}</span>
            <div className="flex items-center">{renderStars(rating)}</div>
            <span className="text-gray-500 text-xs">({ratingCount})</span>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic mt-1">Not yet rated</div>
        )}
      </div>
    </div>
  );
}
