'use client';
import { useState } from 'react';
import RoasterCard from './RoasterCard';
import RoasterModal from './RoasterModal';

export default function RoasterGrid({ featuredRoasters = [], nonFeaturedRoasters = [] }) {
  const [selectedRoaster, setSelectedRoaster] = useState(null);

  const roasters = [...featuredRoasters, ...nonFeaturedRoasters];

  return (
    <div className="max-w-[2200px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {roasters.map((roaster) => (
          <RoasterCard
            key={roaster._id}
            roaster={roaster}
            onClick={() => setSelectedRoaster(roaster)}
          />
        ))}
      </div>

      {selectedRoaster && (
        <RoasterModal
          roaster={selectedRoaster}
          onClose={() => setSelectedRoaster(null)}
        />
      )}
    </div>
  );
}
