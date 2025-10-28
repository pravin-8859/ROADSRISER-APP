export default function BasicDetails({ formData, handleChange }) {
  const handleFileChange = (e) => {
    handleChange("profilePhoto", e.target.files[0]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Basic Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name / Shop Name"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="input-field"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className="input-field"
        />
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="input-field" />
          {formData.profilePhoto && (
            <img
              src={URL.createObjectURL(formData.profilePhoto)}
              alt="Profile Preview"
              className="mt-2 max-w-xs rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}
