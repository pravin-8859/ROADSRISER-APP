// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";

// Imported founder picture
import founderImg from "../assets/MyPic.png";
import fbIcon from "../assets/facebook.png";
import igIcon from "../assets/instagram.png";
import lnIcon from "../assets/linkedin.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 pt-24">

      {/* 🌟 Intro Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 
        bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10
        dark:from-indigo-900/20 dark:via-blue-900/10 dark:to-purple-900/20">

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          About <span className="text-blue-600 dark:text-blue-400">RoadRiser</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
          RoadRiser is built to make roadside emergency help instant, easy, and reliable —
          anytime, anywhere.
        </p>

        <Link
          to="/contact"
          className="mt-6 inline-block bg-gradient-to-r from-indigo-600 to-blue-500 
          text-white px-8 py-3 rounded-full font-semibold shadow-md hover:scale-105 
          transition-transform duration-300"
        >
          Contact Us
        </Link>
      </section>


      {/* 👤 Founder & CEO Section */}
<section className="max-w-6xl mx-auto py-20 px-6 text-center flex flex-col items-center space-y-10">
  <div className="relative">
    <img
      src={founderImg}
      alt="Founder"
      className="w-52 h-52 object-cover rounded-full shadow-2xl border-4 border-indigo-500 dark:border-indigo-400 hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs uppercase font-semibold px-3 py-1 rounded-full shadow-md">
      Founder & CEO
    </div>
  </div>

  {/* Founder Info */}
  <div className="max-w-3xl text-center space-y-4">
    <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-400">
      Pravin Kumar
    </h2>
    <p className="text-gray-600 dark:text-gray-400 text-lg">
      B.Tech CSE Student — GLA University, Mathura (3rd Year)
    </p>
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
      “RoadRiser was born from my vision to connect every stranded traveler with instant roadside help —
      through technology, trust, and teamwork. My goal is to ensure that no one feels helpless when their vehicle breaks down.”
    </p>

    // at the top of About.jsx
import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import linkedinIcon from "../assets/linkedin.png";

{/* 🌐 Social Icons */}
<div className="flex justify-center gap-6 pt-6">
  {/* Facebook */}
  <a
    href="https://www.facebook.com/share/1FaUBUAXFc/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-600 bg-transparent hover:border-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-300"
  >
    <img
      src={facebookIcon}
      alt="Facebook"
      className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
    />
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/pravinn._07?igsh=NHN6NTV6Zjh5ZW40"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-600 bg-transparent hover:border-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.4)] transition-all duration-300"
  >
    <img
      src={instagramIcon}
      alt="Instagram"
      className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
    />
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/pravin9389"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-600 bg-transparent hover:border-blue-600 hover:shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-300"
  >
    <img
      src={linkedinIcon}
      alt="LinkedIn"
      className="w-6 h-6 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
    />
  </a>
</div>


    {/* Connect Button */}
    <div className="pt-6">
      <Link
        to="/contact"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-105"
      >
        Connect with Me
      </Link>
    </div>
  </div>
</section>


      {/* Impact Section */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-14 text-indigo-600 dark:text-indigo-400">
          Our Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { count: "1000+", label: "Active Users" },
            { count: "50+", label: "Mechanics Connected" },
            { count: "10+", label: "Cities Covered" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-indigo-50 dark:bg-gray-800 p-8 rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <h3 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                {item.count}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>


      {/* CTA Section */}
      <section className="text-center py-24 bg-gradient-to-r from-indigo-600 to-blue-600
        dark:from-gray-900 dark:to-gray-800 text-white">
        
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Join the RoadRiser Mission
        </h2>

        <p className="max-w-2xl mx-auto text-lg mb-6 text-blue-100 dark:text-gray-300">
          Be a part of India's fastest emergency roadside assistance revolution.
        </p>

        <Link
          to="/request-help"
          className="bg-white text-indigo-700 dark:bg-indigo-600 dark:text-white 
          font-semibold px-10 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          Request Help
        </Link>
      </section>

    </div>
  );
}
