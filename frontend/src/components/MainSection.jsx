// src/components/MainSection.jsx
import React from 'react';

const features = [
  { icon: 'map-marker-alt', title: 'Real-Time Tracking', desc: 'Know exactly where your mechanic is and when they’ll arrive.' },
  { icon: 'user-check', title: 'Trusted Mechanics', desc: 'We only work with verified and experienced mechanics.' },
  { icon: 'clock', title: '24/7 Assistance', desc: 'Get help anytime, day or night, no matter where you are.' },
  { icon: 'credit-card', title: 'Secure Payments', desc: 'Pay safely using multiple convenient options.' },
  { icon: 'comment-dots', title: 'Direct Chat', desc: 'Message your mechanic directly for quick updates.' },
  { icon: 'star', title: 'Ratings & Reviews', desc: 'See feedback from other users before choosing a service.' },
];

const testimonials = [
  { text: '"I got back on the road in no time—thank you, RoadRiser!"', name: 'Ravi S.' },
  { text: '"Tracking my mechanic in real-time made everything stress-free."', name: 'Priya K.' },
  { text: '"Easy to use and reliable—highly recommend to anyone!"', name: 'Amit P.' },
];

const problems = [
  {
    img: 'https://lh6.googleusercontent.com/proxy/muUhX0E2-fk8JFucsPEU7QiHU2NS-WykvWBGFVjI8mPQCYjqICxUTDDb2EsUcfJKAgj2EdOQXobmQZuF7JrACrvbo387ZAFs-UT4-Q_VN63esMhbyRAergz7JkPunx0vkfsEwehkEb7bmJqonMgOYwWj3iA',
    title: 'Flat Tire',
    desc: 'Got a flat tire in the middle of nowhere? We’ll send help right to you.',
    points: ['Instant mechanic dispatch', 'Live location tracking', 'On-site repair or replacement'],
  },
  {
    img: 'https://www.shutterstock.com/shutterstock/videos/1084642261/thumb/11.jpg?ip=x480',
    title: 'Engine Trouble',
    desc: 'Engine won’t start? Our experts can diagnose and fix the issue quickly.',
    points: ['Specialist support', 'Direct chat with mechanic', 'Verified service providers'],
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMjoJH8r490kYFNGsTJWW8nCMfT551KGEp1A&s',
    title: 'Dead Battery',
    desc: 'Stranded with a dead battery? We offer jump-starts or replacements on the spot.',
    points: ['24/7 emergency help', 'Offline assistance available', 'Secure payments'],
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcdFHczMw3PZQOYEVW0gjP5NuqczJa6kEyRw&s',
    title: 'Need a Tow',
    desc: 'Vehicle won’t move? We connect you with reliable towing services fast.',
    points: ['Real-time coordination', 'Affordable rates', 'ETA updates for peace of mind'],
  },
];

const MainSection = () => {
  return (
    <main className="mt-24 space-y-24 px-4 md:px-12">

      {/* Hero Section */}
      <section className="hero bg-cover bg-center relative min-h-[60vh] flex items-center justify-center text-center text-white" style={{backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Rural+Road+Scene')"}}>
        <div className="bg-black/50 p-8 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Stuck on the road? RoadsRiser has your back!
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Connect with trusted mechanics, get help fast, and get back on your journey without stress.
          </p>
          <a href="#features" className="inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 transition transform hover:scale-105">
            See How We Can Help
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="feature-card bg-indigo-100 p-6 rounded-lg text-center shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2">
              <i className={`fas fa-${f.icon} text-4xl mb-4 text-indigo-700`}></i>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Hear From Our Users</h2>
        <div className="flex overflow-x-auto gap-6 py-6">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card min-w-[280px] bg-indigo-100 p-6 rounded-lg shadow-md text-center">
              <p className="italic">{t.text}</p>
              <p className="font-semibold mt-2">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Help?</h2>
        <a href="#request-help" className="inline-block bg-indigo-600 text-white font-semibold py-4 px-10 rounded-full hover:bg-indigo-700 transition transform hover:scale-105 animate-pulse">
          Request Assistance
        </a>
      </section>

      {/* Problem-Solution Sections */}
      <section className="space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Common Roadside Problems</h2>
        {problems.map((p, i) => (
          <div key={i} className={`problem-section flex flex-col md:flex-row items-center gap-6 bg-white shadow-md rounded-lg p-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <img src={p.img} alt={p.title} className="problem-image w-full md:w-1/2 rounded-lg shadow-md" />
            <div className="solution-details w-full md:w-1/2">
              <h3 className="text-2xl font-bold mb-2 text-indigo-700">{p.title}</h3>
              <p className="text-gray-600 mb-2">{p.desc}</p>
              <ul className="list-disc pl-5 text-gray-600">
                {p.points.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Map Section */}
      <section id="map" className="py-16 bg-gray-100 rounded-lg shadow-md text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Coverage Area</h2>
        <div id="map-placeholder" className="h-96 bg-gray-300 flex items-center justify-center rounded-md text-gray-600 text-lg">
          Map integration coming soon – see where we operate
        </div>
      </section>

    </main>
  );
};

export default MainSection;
