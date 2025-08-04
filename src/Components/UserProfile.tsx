'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/Components/AuthProvider';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';

type Profile = {
  username: string;
  full_name: string;
  website: string;
};

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile>({
    username: '',
    full_name: '',
    website: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, website')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          username: data.username ?? '',
          full_name: data.full_name ?? '',
          website: data.website ?? '',
        });
      } else if (error?.code === 'PGRST116') {
        await supabase.from('profiles').insert({ id: user.id });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    setLoading(true);

    const updates = {
      id: user?.id,
      ...profile,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    setLoading(false);

    if (error) {
      alert('❌ Error updating profile');
    } else {
      alert('✅ Profile updated!');
    }
  };

  if (!user) {
    return (
      <div className="text-center text-white py-12">
        <p className="text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-white py-12">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20 text-white transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm mb-1 text-white">Full Name</label>
          <Input
            placeholder="Full Name"
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
            className="transition-all duration-200 focus:ring-2 focus:ring-white/40"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white">Username</label>
          <Input
            placeholder="Username"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            className="transition-all duration-200 focus:ring-2 focus:ring-white/40"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white">Website</label>
          <Input
            placeholder="Website"
            value={profile.website}
            onChange={(e) =>
              setProfile({ ...profile, website: e.target.value })
            }
            className="transition-all duration-200 focus:ring-2 focus:ring-white/40"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={updateProfile}
          disabled={loading}
          className="transition-colors duration-200"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
