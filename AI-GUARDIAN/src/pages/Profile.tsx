import React from 'react';
import Navbar from '../components/Navbar';

const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Profile content will go here */}
          <p>Profile page under construction</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;