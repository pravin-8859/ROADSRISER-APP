import { useState } from "react";
import BasicDetails from "../components/BasicDetails";
import GarageDetails from "../components/GarageDetails";
import ProfessionalDetails from "../components/ProfessionalDetails";
import VerificationDocuments from "../components/VerificationDocuments";

export default function MechanicSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
    shopName: "",
    shopAddress: "",
    liveLocation: "",
    availability: "24x7",
    distanceRange: "5",
    vehicleCategories: [],
    specializations: [],
    verificationDoc: "",
    shopProof: null,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Mechanic registration submitted!");
    // API call for registration goes here
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-fadeIn">
        <div className="w-full h-2 bg-gray-200 rounded mb-6">
          <div
            className="h-2 bg-indigo-600 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && <BasicDetails formData={formData} handleChange={handleChange} />}
          {step === 2 && <GarageDetails formData={formData} handleChange={handleChange} />}
          {step === 3 && <ProfessionalDetails formData={formData} handleChange={handleChange} />}
          {step === 4 && <VerificationDocuments formData={formData} handleChange={handleChange} />}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Previous
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
