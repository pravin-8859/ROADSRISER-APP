// src/pages/MechanicSearch.jsx
export default function MechanicSearch() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Nearby Mechanics</h2>
      <div className="w-full h-96 bg-gray-300 rounded-lg mb-6"> {/* Map placeholder */}</div>
      <ul className="space-y-4">
        <li className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold">Mechanic 1 (1.2 km)</h3>
          <p>Services: Tire, Battery | Rating: 4.5⭐</p>
        </li>
        <li className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold">Mechanic 2 (3.5 km)</h3>
          <p>Services: Engine, Towing | Rating: 4.0⭐</p>
        </li>
      </ul>
    </div>
  );
}