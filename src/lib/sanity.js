// /lib/sanity.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'oc8v3gu4', // your actual Sanity project ID
  dataset: 'production',
  useCdn: true,           // use the CDN for faster read-only queries
  apiVersion: '2024-07-10', // lock to a specific API version
});
