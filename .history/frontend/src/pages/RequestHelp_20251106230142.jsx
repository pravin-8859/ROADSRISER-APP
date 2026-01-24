// src/pages/RequestHelp.jsx
import { useState } from 'react';

export default function RequestHelp() {
  const [formData, setFormData] = useState({ issue: '', location: '', towing: false });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Assistance</h2>
      <form className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Describe your issue..."
          value={formData.issue}
          onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Enter location or use GPS"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <div>
          <label className="mr-2">Need Towing?</label>
          <input
            type="checkbox"
            checked={formData.towing}
            onChange={(e) => setFormData({ ...formData, towing: e.target.checked })}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit Request</button>
      </form>
    </div>
  );
}