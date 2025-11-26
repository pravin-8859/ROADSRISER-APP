import React, { useEffect, useState } from "react";

// 🖼️ Hero images (local)
import tiremech from "../assets/tiremech.jpg";
import findnearbymech from "../assets/findnearbymech.jpg";
import realtimeTracking from "../assets/realtimetracking.jpg";
import help24hr from "../assets/24hourhelp.jpg";
import verifiedsecurepayment from "../assets/verifiedsecurepayment.jpg";

const features = [
  { icon: "map-marker-alt", title: "Real-Time Tracking", desc: "Know exactly where your mechanic is and when they’ll arrive." },
  { icon: "user-check", title: "Trusted Mechanics", desc: "We only work with verified and experienced mechanics." },
  { icon: "clock", title: "24/7 Assistance", desc: "Get help anytime, day or night, no matter where you are." },
  { icon: "credit-card", title: "Secure Payments", desc: "Pay safely using multiple convenient options." },
  { icon: "comment-dots", title: "Direct Chat", desc: "Message your mechanic directly for quick updates." },
  { icon: "star", title: "Ratings & Reviews", desc: "See feedback from other users before choosing a service." },
];

const testimonials = [
  { text: '"I got back on the road in no time—thank you, RoadRiser!"', name: "Ravi S." },
  { text: '"Tracking my mechanic in real-time made everything stress-free."', name: "Priya K." },
  { text: '"Easy to use and reliable—highly recommend to anyone!"', name: "Amit P." },
];

const heroSlides = [
  { img: findnearbymech, title: "Find Nearby Mechanics Instantly", desc: "RoadsRiser connects you with trusted experts near your location within minutes." },
  { img: help24hr, title: "24×7 Emergency Roadside Help", desc: "Anytime, anywhere — we’ll get you back on the road without stress." },
  { img: realtimeTracking, title: "Real-Time Tracking & Live Updates", desc: "Know where your mechanic is and when they’ll reach you, live on the map." },
  { img: verifiedsecurepayment, title: "Verified Mechanics & Secure Payments", desc: "All mechanics are verified professionals with secure payment options." },
  { img: tiremech, title: "We Fix Everything — Fast & Reliable", desc: "Flat tire, dead battery, engine issues — we’re always ready to assist." },
];

// Original problems section images (external links)
const problems = [
  {
    img: "https://lh6.googleusercontent.com/proxy/muUhX0E2-fk8JFucsPEU7QiHU2NS-WykvWBGFVjI8mPQCYjqICxUTDDb2EsUcfJKAgj2EdOQXobmQZuF7JrACrvbo387ZAFs-UT4-Q_VN63esMhbyRAergz7JkPunx0vkfsEwehkEb7bmJqonMgOYwWj3iA",
    title: "Flat Tire",
    desc: "Got a flat tire in the middle of nowhere? We’ll send help right to you.",
    points: ["Instant mechanic dispatch", "Live location tracking", "On-site repair or replacement"],
  },
  {
    img: "https://www.shutterstock.com/shutterstock/videos/1084642261/thumb/11.jpg?ip=x480",
    title: "Engine Trouble",
    desc: "Engine won’t start? Our experts diagnose and fix issues quickly.",
    points: ["Specialist support", "Direct chat with mechanic", "Verified service providers"],
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMjoJH8r490kYFNGsTJWW8nCMfT551KGEp1A&s",
    title: "Dead Battery",
    desc: "Stranded with a dead battery? Get jump-starts or replacements instantly.",
    points: ["24/7 emergency help", "Offline assistance", "Secure payments"],
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcdFHczMw3PZQOYEVW0gjP5NuqczJa6kEyRw&s",
    title: "Need a Tow",
    desc: "Vehicle won’t move? We'll connect you with reliable towing services fast.",
    points: ["Real-time coordination", "Affordable rates", "ETA updates for peace of mind"],
  },
];

export default function MainSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="mt-24 space-y-24 px-4 md:px-12 dark:text-gray-100">

      {/* HERO SECTION */}
      <section className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] ${
              currentSlide === i ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url(${slide.img})`, filter: "brightness(72%)" }}
          ></div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-gray-100 dark:to-gray-900"></div>

        <div className="relative z-10 max-w-3xl text-white text-center px-6 md:px-10 py-10 bg-black/20 dark:bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            {heroSlides[currentSlide].desc}
          </p>
          <a
            href="#features"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold py-3 px-10 rounded-full shadow-lg hover:scale-105 transition"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-lg text-center shadow-md hover:shadow-xl transition-transform hover:-translate-y-2"
            >
              <i className={`fas fa-${f.icon} text-4xl mb-4 text-indigo-700 dark:text-indigo-300`} />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Hear From Our Users</h2>
        <div className="flex overflow-x-auto gap-6 py-6">
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-[280px] bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-lg shadow-md">
              <p className="italic">{t.text}</p>
              <p className="font-semibold mt-2">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Help?</h2>
        <a
          href="/request-help"
          className="inline-block bg-indigo-600 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          Request Assistance
        </a>
      </section>

      {/* COMMON PROBLEMS */}
      <section className="space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Common Roadside Problems</h2>

        {problems.map((p, i) => (
          <div
            key={i}
            className={`flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <img src={p.img} alt={p.title} className="w-full md:w-1/2 rounded-lg shadow-md" />
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">
                {p.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{p.desc}</p>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                {p.points.map((pt, idx) => <li key={idx}>{pt}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* MAP */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Coverage Area</h2>
        <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center justify-center">
          Map integration coming soon — see where we operate
        </div>
      </section>

    </main>
  );
}
