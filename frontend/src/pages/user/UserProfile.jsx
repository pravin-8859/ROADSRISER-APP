import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function UserProfile() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/me"); // your backend should return current user
      setProfile(res.data.user || {});
    } catch (err) {
      console.log(err);
      alert("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  const handleUpdate = async () => {
    try {
      await API.put("/users/me", profile);
      alert("Profile updated");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm">Full name</label>
        <input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} className="input" />
      </div>

      <div>
        <label className="text-sm">Email</label>
        <input value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} className="input" />
      </div>

      <div>
        <label className="text-sm">Phone</label>
        <input value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} className="input" />
      </div>

      <div className="flex gap-3">
        <button onClick={handleUpdate} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Save</button>
        <button onClick={()=>alert("Change password flow not implemented here")} className="px-4 py-2 rounded-lg border">Change password</button>
      </div>

      <style>{`.input{width:100%;padding:10px;border-radius:10px;border:1px solid #e5e7eb;background:transparent}`}</style>
    </div>
  );
}
