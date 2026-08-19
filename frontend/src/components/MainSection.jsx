import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield,
  FiStar,
  FiTool,
  FiZap,
  FiBattery,
  FiTruck,
  FiDroplet,
  FiNavigation,
} from "react-icons/fi";

import tiremech from "../assets/tiremech.jpg";
import findnearbymech from "../assets/findnearbymech.jpg";
import realtimeTracking from "../assets/realtimetracking.jpg";
import help24hr from "../assets/24hourhelp.jpg";
import verifiedsecurepayment from "../assets/verifiedsecurepayment.jpg";
import battery from "../assets/battery.png";
import petrol from "../assets/petrol.png";
import tire from "../assets/tire.png";
import engineOil from "../assets/engine-oil.png";

const heroSlides = [
  {
    image: findnearbymech,
    eyebrow: "ROADSIDER ASSISTANCE",
    title: "Stranded on the road?",
    highlight: "We've got you.",
    description:
      "Connect with trusted mechanics near you and get back on the road without the stress.",
  },
  {
    image: realtimeTracking,
    eyebrow: "LIVE ASSISTANCE",
    title: "Help is closer",
    highlight: "than you think.",
    description:
      "Find nearby mechanics and keep track of your assistance in real time.",
  },
  {
    image: help24hr,
    eyebrow: "24/7 EMERGENCY SUPPORT",
    title: "Breakdowns don't",
    highlight: "keep a schedule.",
    description:
      "RoadsRiser helps you find roadside assistance whenever you need it.",
  },
  {
    image: verifiedsecurepayment,
    eyebrow: "TRUSTED SERVICE",
    title: "Verified mechanics.",
    highlight: "Reliable help.",
    description:
      "Get assistance from verified professionals with a transparent service experience.",
  },
];

const services = [
  {
    title: "Flat Tyre",
    description: "Quick tyre repair or replacement when you need it most.",
    image: tire,
    icon: FiTool,
  },
  {
    title: "Battery Assistance",
    description: "Jump-start or battery assistance to get your vehicle moving.",
    image: battery,
    icon: FiBattery,
  },
  {
    title: "Engine Trouble",
    description: "Professional help for unexpected engine problems.",
    image: engineOil,
    icon: FiZap,
  },
  {
    title: "Fuel Delivery",
    description: "Running low on fuel? Get roadside fuel assistance.",
    image: petrol,
    icon: FiDroplet,
  },
  {
    title: "Towing",
    description: "Reliable towing assistance when your vehicle cannot move.",
    image: tiremech,
    icon: FiTruck,
  },
  {
    title: "Emergency Help",
    description: "Get connected with roadside assistance around you.",
    image: help24hr,
    icon: FiNavigation,
  },
];

const steps = [
  {
    number: "01",
    title: "Request Help",
    description: "Tell us what happened and share your location.",
    icon: FiTool,
  },
  {
    number: "02",
    title: "Get Matched",
    description: "We connect you with an available mechanic nearby.",
    icon: FiMapPin,
  },
  {
    number: "03",
    title: "Track Assistance",
    description: "Keep an eye on your mechanic and their arrival.",
    icon: FiNavigation,
  },
  {
    number: "04",
    title: "Get Back On Road",
    description: "Your mechanic resolves the problem and you're ready to go.",
    icon: FiCheckCircle,
  },
];

const testimonials = [
  {
    text: "RoadsRiser made getting roadside help incredibly simple. I knew where my mechanic was the whole time.",
    name: "Ravi S.",
    role: "RoadsRiser User",
  },
  {
    text: "The idea of finding a nearby verified mechanic when you're stuck is exactly what drivers need.",
    name: "Priya K.",
    role: "RoadsRiser User",
  },
  {
    text: "Fast, simple and much less stressful than trying to find help on the road yourself.",
    name: "Amit P.",
    role: "RoadsRiser User",
  },
];

export default function MainSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const hero = heroSlides[currentSlide];

  return (
    <main className="overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">

        {/* Background */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? "scale-100 opacity-100"
                : "scale-110 opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(59,130,246,0.28),transparent_35%)]" />

        {/* Floating decorative circles */}
        <div className="absolute right-[8%] top-[18%] hidden h-32 w-32 rounded-full border border-white/20 bg-white/5 backdrop-blur-md lg:block animate-pulse" />
        <div className="absolute right-[16%] bottom-[20%] hidden h-20 w-20 rounded-full border border-blue-400/30 bg-blue-500/10 lg:block" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-20 lg:px-8">

          <div className="max-w-3xl text-white">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              {hero.eyebrow}
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
              {hero.title}
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                {hero.highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              {hero.description}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <Link
                to="/request-help"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 font-bold text-white shadow-2xl shadow-blue-600/30 transition hover:-translate-y-1 hover:bg-blue-500"
              >
                Request Assistance
                <FiArrowRight className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/mechanic-search"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20"
              >
                <FiMapPin />
                Find a Mechanic
              </Link>

            </div>

            {/* Trust */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-green-400" />
                Verified Mechanics
              </span>

              <span className="flex items-center gap-2">
                <FiClock className="text-blue-400" />
                24/7 Assistance
              </span>

              <span className="flex items-center gap-2">
                <FiShield className="text-cyan-400" />
                Secure Service
              </span>
            </div>
          </div>

          {/* Floating visual card */}
          <div className="absolute bottom-10 right-8 hidden w-80 lg:block">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl">

              <div className="relative h-44 overflow-hidden rounded-2xl">
                <img
                  src={hero.image}
                  alt="Roadside assistance"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-lg">
                    <FiCheckCircle />
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      Assistance available
                    </p>
                    <p className="text-xs text-slate-300">
                      Finding help near you
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-white">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Service online
                </span>

                <span className="text-slate-300">
                  Live
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Slider controls */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "w-10 bg-white"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================
          TRUST STRIP
      ========================================================= */}
      <section className="relative z-10 -mt-1 border-y border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 dark:divide-white/10 md:grid-cols-4">

          {[
            ["24/7", "Roadside Assistance"],
            ["Verified", "Mechanic Network"],
            ["Live", "Location Tracking"],
            ["Secure", "Service Experience"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-7 text-center">
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 sm:text-2xl">
                {value}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Roadside Services
          </span>

          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Whatever happened,
            <span className="text-blue-600 dark:text-blue-400">
              {" "}we can help.
            </span>
          </h2>

          <p className="mt-5 text-slate-600 dark:text-slate-400">
            From a flat tyre to a vehicle breakdown, get connected with
            roadside assistance when you need it.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl">
                    <Icon size={22} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {service.description}
                  </p>

                  <Link
                    to="/request-help"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400"
                  >
                    Get assistance
                    <FiArrowRight className="transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="bg-slate-900 py-24 text-white dark:bg-black">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Simple Process
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Help in four simple steps.
            </h2>

            <p className="mt-5 text-slate-400">
              No complicated process. Tell us what happened and let
              RoadsRiser handle the rest.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">

                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-5xl font-black text-white/10">
                      {step.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                      <Icon />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          LIVE TRACKING PROMO
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 p-8 text-white shadow-2xl sm:p-12 lg:p-16">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">

            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <FiNavigation className="mr-2" />
                Live assistance
              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
                Help is on the way.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-blue-100">
                Stay informed while your mechanic is heading towards you.
                RoadsRiser is designed to make roadside assistance feel
                simple, transparent and stress-free.
              </p>

              <Link
                to="/request-help"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-blue-700 transition hover:-translate-y-1 hover:shadow-xl"
              >
                Request Assistance
                <FiArrowRight />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">

                <div className="relative h-72 overflow-hidden rounded-2xl">
                  <img
                    src={realtimeTracking}
                    alt="Real-time tracking"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-black/30 p-4 backdrop-blur-xl">

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                          <FiNavigation />
                        </span>

                        <div>
                          <p className="font-semibold">
                            Mechanic is on the way
                          </p>
                          <p className="text-xs text-slate-300">
                            Live location active
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-green-400">
                        LIVE
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          WHY ROADSRISER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/20 blur-3xl" />

            <img
              src={verifiedsecurepayment}
              alt="Verified roadside assistance"
              className="relative h-[450px] w-full rounded-[2rem] object-cover shadow-2xl"
            />

            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-black/50 p-5 text-white shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <FiShield className="text-green-400" size={24} />
                <div>
                  <p className="font-bold">Built around trust</p>
                  <p className="text-xs text-slate-300">
                    Verified service experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              Why RoadsRiser
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Roadside assistance,
              <span className="text-blue-600 dark:text-blue-400">
                {" "}without the uncertainty.
              </span>
            </h2>

            <p className="mt-6 leading-7 text-slate-600 dark:text-slate-400">
              We bring roadside assistance, location technology and trusted
              mechanics together into one simple experience.
            </p>

            <div className="mt-8 space-y-5">

              {[
                [
                  FiShield,
                  "Verified Mechanics",
                  "Connect with mechanics through a trusted service network.",
                ],
                [
                  FiNavigation,
                  "Real-Time Tracking",
                  "Know where your assistance is while help is on the way.",
                ],
                [
                  FiClock,
                  "24/7 Assistance",
                  "Roadside problems don't follow a schedule. Neither do we.",
                ],
                [
                  FiStar,
                  "Better Experience",
                  "Clear communication and a simpler way to get help.",
                ],
              ].map(([Icon, title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon />
                  </div>

                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <section className="bg-slate-100 py-24 dark:bg-slate-900">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              User Stories
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Drivers trust the experience.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-slate-950"
              >
                <div className="flex gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} fill="currentColor" size={17} />
                  ))}
                </div>

                <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">
                  “{item.text}”
                </p>

                <div className="mt-7 border-t border-slate-200 pt-5 dark:border-white/10">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-28 text-center text-white">

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-300">
            <FiZap />
            Roadside help, simplified
          </span>

          <h2 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
            Don't let a breakdown
            <span className="block text-blue-400">
              stop your journey.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-7 text-slate-400">
            Get connected with roadside assistance and take the next step
            towards getting back on the road.
          </p>

          <Link
            to="/request-help"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-bold shadow-2xl shadow-blue-600/30 transition hover:-translate-y-1 hover:bg-blue-500"
          >
            Request Assistance
            <FiArrowRight />
          </Link>

        </div>
      </section>

    </main>
  );
}