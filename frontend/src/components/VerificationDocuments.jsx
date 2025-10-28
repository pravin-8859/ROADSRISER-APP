import { useState } from "react";

export default function VerificationDocuments({ formData, handleChange }) {
  const [preview, setPreview] = useState(null);

  const handleShopProof = (e) => {
    const file = e.target.files[0];
    handleChange("shopProof", file);
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
        Verification Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aadhaar / DL / GST */}
        <input
          type="text"
          placeholder="Aadhaar / Driving License / GST Number"
          value={formData.verificationDoc}
          onChange={(e) => handleChange("verificationDoc", e.target.value)}
          className="input-field"
        />

        {/* Shop Registration Proof */}
        <div>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleShopProof}
            className="input-field"
          />
          {preview && (
            <div className="mt-2">
              {formData.shopProof.type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt="Shop Proof Preview"
                  className="max-w-xs max-h-32 rounded-lg"
                />
              ) : (
                <p className="text-gray-700 mt-2">
                  {formData.shopProof.name} (PDF)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
