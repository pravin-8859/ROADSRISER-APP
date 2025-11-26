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


      {/* 👑 Founder Section */}
      <section className="max-w-6xl mx-auto py-20 px-6 flex flex-col md:flex-row items-center gap-12">
        
        {/* Founder Photo */}
        <div className="flex flex-col items-center">
          <div className="w-56 h-56 rounded-full overflow-hidden shadow-2xl border-4 border-indigo-500 dark:border-indigo-400">
            <img 
              src={founderImg} 
              alt="Founder" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6 mt-6">
            <a href="https://www.facebook.com/share/1FaUBUAXFc/" 
              target="_blank"
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:scale-110 transition">
              <img src={fbIcon} alt="Facebook" className="w-6" />
            </a>

            <a href="https://www.instagram.com/pravinn._07?igsh=NHN6NTV6Zjh5ZW40" 
              target="_blank"
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:scale-110 transition">
              <img src={igIcon} alt="Instagram" className="w-6" />
            </a>

            <a href="https://www.linkedin.com/in/pravin9389" 
              target="_blank"
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:scale-110 transition">
              <img src={lnIcon} alt="LinkedIn" className="w-6" />
            </a>
          </div>
        </div>

        {/* Founder Info */}
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Founder & CEO — Pravin Kumar
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            I’m <span className="font-semibold text-indigo-600 dark:text-indigo-300">Pravin Kumar</span>,
            B.Tech (CSE) student at  
            <span className="font-semibold"> GLA University, Mathura</span>.  
            Currently in <span className="font-semibold">3rd Year</span>.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
            RoadRiser is inspired by real on-road struggles faced by people when no mechanic
            is available nearby. My goal is to build India’s fastest emergency roadside assistance platform.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300">
            With modern technology and verified mechanics, RoadRiser ensures help reaches drivers
            quickly and safely — anytime, anywhere.
          </p>
        </div>
      </section>


      {/* ⚙️ Key Features */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Why Choose RoadRiser?
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {[
            {
              icon: "fa-bolt",
              title: "Instant SOS Response",
              desc: "Nearby mechanics get your alert instantly and respond faster than ever.",
            },
            {
              icon: "fa-user-shield",
              title: "100% Verified Mechanics",
              desc: "Only trusted and skilled mechanics join RoadRiser — your safety first.",
            },
            {
              icon: "fa-map-marked-alt",
              title: "Live Tracking System",
              desc: "Track your mechanic live in real-time until they reach your location.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl 
              text-center transition-transform transform hover:-translate-y-2"
            >
              <i className={`fas ${f.icon} text-4xl text-indigo-600 dark:text-indigo-300 mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
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
