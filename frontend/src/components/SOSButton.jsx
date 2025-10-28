import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SOSButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Example: token check (you can replace with your auth state or context)
  const isLoggedIn = !!localStorage.getItem("token"); // token stored on login

  const sendSOS = async () => {
    if (!isLoggedIn) {
      alert("⚠️ Please login first to request help.");
      navigate("/auth"); // redirect to login/signup page
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Optionally, get live location
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        const response = await fetch("http://localhost:5000/api/report/sos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            latitude,
            longitude,
            type: "Emergency SOS",
          }),
        });

        if (response.ok) {
          setMessage("🚨 SOS request sent successfully!");
        } else {
          setMessage("❌ Failed to send SOS request.");
        }
        setLoading(false);
      });
    } catch (err) {
      setMessage("⚠️ Error getting location or sending request.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={sendSOS}
        disabled={loading}
        className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-full shadow-lg text-white font-bold text-lg transition-all ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Sending..." : "🚨 SOS"}
      </button>

      {/* Response message */}
      {message && (
        <div className="fixed bottom-20 right-6 bg-white border border-gray-300 shadow-md p-3 rounded-md text-gray-800 text-sm">
          {message}
        </div>
      )}
    </>
  );
}
