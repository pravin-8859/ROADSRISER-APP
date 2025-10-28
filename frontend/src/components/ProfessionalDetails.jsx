export default function ProfessionalDetails({ formData, handleChange }) {
  const handleCheckbox = (field, value) => {
    const updated = formData[field].includes(value)
      ? formData[field].filter((v) => v !== value)
      : [...formData[field], value];
    handleChange(field, updated);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Professional Details</h2>
      <div className="mb-4">
        <label className="block mb-2">Vehicle Categories</label>
        <div className="flex flex-wrap gap-4">
          {["Two-wheelers", "Cars", "Trucks"].map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.vehicleCategories.includes(v)}
                onChange={() => handleCheckbox("vehicleCategories", v)}
              />
              {v}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Specializations</label>
        <div className="grid grid-cols-2 gap-2">
          {["Engine Repair","Tyre Replacement","Battery Issues","Towing","Emergency Fixes"].map((s) => (
            <label key={s} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.specializations.includes(s)}
                onChange={() => handleCheckbox("specializations", s)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
