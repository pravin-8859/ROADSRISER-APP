// src/components/FAQItem.jsx
import { useState } from 'react';

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 py-4">
      <button
        className="w-full text-left flex justify-between items-center font-medium text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600">{answer}</p>
      )}
    </div>
  );
}
