import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import sanityClient from '@sanity/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-10-01',
});

async function syncRatings() {
  const { data: ratings, error } = await supabase
    .from('roaster_ratings')
    .select('roaster_id, rating');

  if (error) throw error;

  const roasterStats = ratings.reduce((acc, curr) => {
    const { roaster_id, rating } = curr;
    if (!acc[roaster_id]) {
      acc[roaster_id] = { sum: 0, count: 0 };
    }
    acc[roaster_id].sum += rating;
    acc[roaster_id].count += 1;
    return acc;
  }, {});

  const updates = Object.entries(roasterStats).map(async ([roasterId, { sum, count }]) => {
  const avg = Math.round((sum / count) * 100) / 100;
  console.log(`Updating Sanity → ID: ${roasterId} | Avg: ${avg} | Count: ${count}`);
  
  return sanity
    .patch(roasterId)
    .set({ rating: avg, ratingCount: count })
    .commit()
    .then(() => console.log(`✅ Success: ${roasterId}`))
    .catch((err) => console.error(`❌ Failed: ${roasterId}`, err.message));
});


  await Promise.all(updates);
  console.log('🎉 Done syncing ratings');
}

syncRatings().catch(console.error);
