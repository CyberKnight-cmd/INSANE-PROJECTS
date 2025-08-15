import React from 'react';
import Navbar from '../components/Navbar';
import { EmergencySettings } from '../components/EmergencySettings';

const Settings = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <EmergencySettings />
          {/* Additional settings will go here */}
        </div>
      </main>
    </div>
  );
};

export default Settings;