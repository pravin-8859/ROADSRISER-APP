// src/pages/Services.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBatteryCharging,
  FiCheckCircle,
  FiClock,
  FiDroplet,
  FiMapPin,
  FiPhoneCall,
  FiShield,
  FiTool,
  FiTruck,
  FiZap,
} from "react-icons/fi";

import tireImg from "../assets/tiremech.jpg";
import nearbyImg from "../assets/findnearbymech.jpg";
import trackingImg from "../assets/realtimetracking.jpg";
import paymentImg from "../assets/verifiedsecurepayment.jpg";

export default function Services() {
  const services = [
    {
      icon: FiTool,
      title: "Mechanical Repairs",
      description:
        "Get professional roadside help for engine, brake, clutch and other mechanical problems.",
      tag: "Most Requested",
      image: tireImg,
    },
    {
      icon: FiTruck,
      title: "Towing Service",
      description:
        "When your vehicle cannot move, connect with towing assistance and get it to a nearby garage.",
      tag: "Emergency",
      image: nearbyImg,
    },
    {
      icon: FiDroplet,
      title: "Fuel Delivery",
      description:
        "Ran out of fuel? Request nearby fuel assistance and get back on the road faster.",
      tag: "24/7",
      image: paymentImg,
    },
    {
      icon: FiBatteryCharging,
      title: "Battery Assistance",
      description:
        "Dead battery? Get jump-start assistance or battery-related roadside support.",
      tag: "Quick Help",
      image: trackingImg,
    },
    {
      icon: FiZap,
      title: "Emergency Assistance",
      description:
        "For unexpected roadside situations, request assistance and get connected with available help.",
      tag: "SOS",
      image: nearbyImg,
    },
    {
      icon: FiMapPin,
      title: "Nearby Mechanic",
      description:
        "Discover nearby mechanics and choose roadside assistance according to your situation.",
      tag: "Location Based",
      image: trackingImg,
    },
  ];

  const plans = [
    {
      name: "Quick Help",
      price: "₹499",
      description: "For simple roadside problems.",
      features: [
        "Emergency roadside assistance",
        "Battery jump-start",
        "Nearby mechanic connection",
        "Basic roadside support",
      ],
    },
    {
      name: "Standard",
      price: "₹999",
      popular: true,
      description: "A balanced roadside assistance option.",
      features: [
        "Everything in Quick Help",
        "Minor roadside repairs",
        "Basic vehicle inspection",
        "Priority assistance",
      ],
    },
    {
      name: "Premium",
      price: "₹1,499",
      description: "For complete roadside support.",
      features: [
        "Everything in Standard",
        "Towing assistance",
        "Fuel delivery",
        "Full vehicle checkup",
      ],
    },
  ];

  return (
    <main className="overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white sm:py-36">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.3),transparent_35%)]" />

        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          <div>

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              <FiZap />
              ROADSRISER SERVICES
            </span>

            <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Roadside help,
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                when you need it.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              From flat tyres and dead batteries to towing and mechanical
              problems, RoadsRiser helps connect you with roadside assistance
              through one simple platform.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <Link
                to="/request-help"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-bold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
              >
                Request Assistance
                <FiArrowRight className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/mechanic-search"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 font-bold backdrop-blur-xl transition hover:bg-white/10"
              >
                Find a Mechanic
              </Link>

            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">

              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-green-400" />
                Verified Assistance
              </span>

              <span className="flex items-center gap-2">
                <FiClock className="text-blue-400" />
                24/7 Support
              </span>

              <span className="flex items-center gap-2">
                <FiShield className="text-cyan-400" />
                Secure Experience
              </span>

            </div>

          </div>

          {/* Hero visual */}
          <div className="relative">

            <div className="absolute -inset-6 rounded-[3rem] bg-blue-600/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl">

              <div className="relative h-[450px] overflow-hidden rounded-[1.5rem]">

                <img
                  src={tireImg}
                  alt="Roadside mechanic assistance"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">

                  <div className="rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-xl">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-blue-300">
                          Roadside Assistance
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          Help is closer than you think.
                        </p>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-lg">
                        <FiCheckCircle size={23} />
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">

          <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            What We Do
          </span>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Everything you need
            <span className="block text-blue-600 dark:text-blue-400">
              when you're stuck.
            </span>
          </h2>

          <p className="mt-5 leading-7 text-slate-500 dark:text-slate-400">
            Choose the type of roadside assistance you need and connect with
            available help.
          </p>

        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => {

            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900"
              >

                <div className="relative h-48 overflow-hidden">

                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xl">
                    {service.tag}
                  </span>

                  <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl">
                    <Icon size={22} />
                  </div>

                </div>

                <div className="p-7">

                  <h3 className="text-xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    {service.description}
                  </p>

                  <Link
                    to="/request-help"
                    className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400"
                  >
                    Request this service
                    <FiArrowRight className="transition group-hover/link:translate-x-1" />
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

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Simple Process
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Help in three simple steps.
            </h2>

          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">

            {[
              {
                number: "01",
                icon: FiPhoneCall,
                title: "Request Help",
                text: "Tell us what happened and share your location.",
              },
              {
                number: "02",
                icon: FiMapPin,
                title: "Get Connected",
                text: "Connect with an available roadside professional.",
              },
              {
                number: "03",
                icon: FiCheckCircle,
                title: "Get Back on Road",
                text: "Track assistance and get your vehicle moving again.",
              },
            ].map((step) => {

              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-2 hover:bg-white/[0.07]"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                      <Icon size={24} />
                    </div>

                    <span className="text-5xl font-black text-white/[0.06]">
                      {step.number}
                    </span>

                  </div>

                  <h3 className="mt-7 text-2xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {step.text}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          LIVE EXPERIENCE
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div>

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              Connected Assistance
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Know what's happening
              <span className="block text-blue-600 dark:text-blue-400">
                every step of the way.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-500 dark:text-slate-400">
              RoadsRiser is designed to keep the assistance journey clear.
              From finding nearby mechanics to tracking assistance, you stay
              informed instead of waiting blindly.
            </p>

            <div className="mt-8 space-y-4">

              {[
                "Find nearby roadside assistance",
                "Track your request in real time",
                "Stay connected with your mechanic",
                "Transparent service experience",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <FiCheckCircle className="shrink-0 text-green-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </div>

              ))}

            </div>

            <Link
              to="/mechanic-search"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Explore Nearby Mechanics
              <FiArrowRight className="transition group-hover:translate-x-1" />
            </Link>

          </div>

          <div className="relative">

            <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-slate-900">

              <img
                src={trackingImg}
                alt="Real-time tracking"
                className="h-[450px] w-full rounded-[1.5rem] object-cover"
              />

              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur-xl">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600">
                    <FiMapPin />
                  </div>

                  <div>
                    <p className="font-bold">
                      Mechanic is on the way
                    </p>

                    <p className="text-xs text-slate-400">
                      Live location updates available
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          PRICING
      ========================================================= */}
      <section className="bg-slate-100 py-24 dark:bg-slate-900/50">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              Pricing
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Simple plans.
              <span className="block text-blue-600 dark:text-blue-400">
                No unnecessary complexity.
              </span>
            </h2>

            <p className="mt-5 text-slate-500 dark:text-slate-400">
              These are indicative service packages. Final pricing may vary
              depending on the actual roadside assistance required.
            </p>

          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">

            {plans.map((plan) => (

              <div
                key={plan.name}
                className={`relative rounded-3xl border p-8 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular
                    ? "border-blue-500 bg-slate-950 text-white shadow-2xl shadow-blue-500/10"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"
                }`}
              >

                {plan.popular && (
                  <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                  </span>
                )}

                <h3 className="text-2xl font-black">
                  {plan.name}
                </h3>

                <p
                  className={`mt-2 text-sm ${
                    plan.popular
                      ? "text-slate-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-7">

                  <span className="text-4xl font-black">
                    {plan.price}
                  </span>

                  <span
                    className={`ml-2 text-sm ${
                      plan.popular
                        ? "text-slate-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    / service
                  </span>

                </div>

                <div className="my-7 h-px bg-slate-200 dark:bg-white/10" />

                <ul className="space-y-4">

                  {plan.features.map((feature) => (

                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <FiCheckCircle className="mt-0.5 shrink-0 text-green-500" />
                      <span
                        className={
                          plan.popular
                            ? "text-slate-300"
                            : "text-slate-600 dark:text-slate-300"
                        }
                      >
                        {feature}
                      </span>
                    </li>

                  ))}

                </ul>

                <Link
                  to="/request-help"
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Request Service
                  <FiArrowRight />
                </Link>

              </div>

            ))}

          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
            * Pricing shown is indicative and may change based on vehicle,
            location, service type and actual assistance required.
          </p>

        </div>

      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 px-6 py-24 text-center text-white">

        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
            <FiPhoneCall />
            Need Assistance?
          </span>

          <h2 className="mt-6 text-4xl font-black sm:text-6xl">
            Don't stay stranded.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-blue-100">
            Request roadside assistance and take the next step towards getting
            back on the road.
          </p>

          <Link
            to="/request-help"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 font-bold text-blue-700 shadow-2xl transition hover:-translate-y-1"
          >
            Request Roadside Help
            <FiArrowRight className="transition group-hover:translate-x-1" />
          </Link>

        </div>

      </section>

    </main>
  );
}