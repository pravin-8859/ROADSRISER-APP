export default function GarageDetails({ formData, handleChange }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Garage Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Shop Name"
          value={formData.shopName}
          onChange={(e) => handleChange("shopName", e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Shop Address"
          value={formData.shopAddress}
          onChange={(e) => handleChange("shopAddress", e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Live Location"
          value={formData.liveLocation}
          onChange={(e) => handleChange("liveLocation", e.target.value)}
          className="input-field"
        />
        <select
          value={formData.availability}
          onChange={(e) => handleChange("availability", e.target.value)}
          className="input-field"
        >
          <option value="24x7">24×7</option>
          <option value="specific">Specific Hours</option>
        </select>
        <select
          value={formData.distanceRange}
          onChange={(e) => handleChange("distanceRange", e.target.value)}
          className="input-field"
        >
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="20">20 km</option>
          <option value="50">50 km</option>
        </select>
      </div>
    </div>
  );
}
