import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield,
  FiStar,
  FiTarget,
  FiUsers,
  FiZap,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";

import founderImg from "../assets/MyPic.png";
import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import linkedinIcon from "../assets/linkedin.png";
import realtimeTracking from "../assets/realtimetracking.jpg";
import findnearbymech from "../assets/findnearbymech.jpg";
import verifiedsecurepayment from "../assets/verifiedsecurepayment.jpg";

const values = [
  {
    icon: FiShield,
    title: "Trust First",
    description:
      "Creating a dependable roadside assistance experience where drivers know what to expect.",
  },
  {
    icon: FiZap,
    title: "Fast Assistance",
    description:
      "Because when something goes wrong on the road, every minute matters.",
  },
  {
    icon: FiUsers,
    title: "People First",
    description:
      "Connecting drivers and roadside professionals through a simple digital experience.",
  },
  {
    icon: FiTarget,
    title: "Real Problems",
    description:
      "Built around the situations drivers actually face when they get stranded.",
  },
];

const features = [
  {
    icon: FiMapPin,
    title: "Nearby Assistance",
    text: "Find roadside help around your location.",
  },
  {
    icon: FiShield,
    title: "Verified Network",
    text: "Connect through a trusted mechanic ecosystem.",
  },
  {
    icon: FiClock,
    title: "24/7 Support",
    text: "Roadside problems can happen anytime.",
  },
  {
    icon: FiStar,
    title: "Better Experience",
    text: "Simple communication from request to resolution.",
  },
];

export default function About() {
  return (
    <main className="overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white sm:py-36">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.25),transparent_35%)]" />

        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur-xl">
                <FiZap />
                ABOUT ROADSRISER
              </span>

              <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                We're building a better way to
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  get roadside help.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                RoadsRiser is built to make roadside assistance simpler,
                faster and more transparent — connecting drivers with
                roadside professionals when they need help.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/request-help"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 font-bold transition hover:-translate-y-1 hover:bg-blue-500"
                >
                  Get Roadside Help
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-bold backdrop-blur-xl transition hover:bg-white/10"
                >
                  Talk to Us
                </Link>

              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">

              <div className="absolute -inset-6 rounded-[3rem] bg-blue-600/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl">

                <div className="relative h-[430px] overflow-hidden rounded-[1.5rem]">

                  <img
                    src={findnearbymech}
                    alt="Roadside assistance"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-black/40 p-5 backdrop-blur-xl">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg">
                        <FiCheckCircle size={23} />
                      </div>

                      <div>
                        <p className="font-bold">
                          Help when you need it
                        </p>

                        <p className="text-sm text-slate-300">
                          Connecting drivers with roadside assistance
                        </p>
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
          STATS
      ========================================================= */}
      <section className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 dark:divide-white/10 md:grid-cols-4">

          {[
            ["24/7", "Assistance"],
            ["Verified", "Mechanic Network"],
            ["Live", "Location Tracking"],
            ["Secure", "Service Experience"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-8 text-center">

              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {value}
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {label}
              </p>

            </div>
          ))}

        </div>
      </section>

      {/* =========================================================
          OUR STORY
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div className="relative">

            <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/20 blur-3xl" />

            <img
              src={realtimeTracking}
              alt="Real-time roadside assistance"
              className="relative h-[430px] w-full rounded-[2rem] object-cover shadow-2xl"
            />

            <div className="absolute -bottom-6 -right-4 rounded-2xl border border-white/20 bg-slate-950 p-5 text-white shadow-2xl sm:-right-6">

              <div className="flex items-center gap-3">

                <FiMapPin
                  className="text-blue-400"
                  size={25}
                />

                <div>
                  <p className="font-bold">
                    Technology + Assistance
                  </p>

                  <p className="text-xs text-slate-400">
                    Built around real roadside problems
                  </p>
                </div>

              </div>

            </div>
          </div>

          <div>

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              Our Story
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              A simple idea:
              <span className="block text-blue-600 dark:text-blue-400">
                make getting help easier.
              </span>
            </h2>

            <p className="mt-6 leading-7 text-slate-600 dark:text-slate-400">
              Getting stuck on the road can be stressful. Finding a reliable
              mechanic, explaining your location and waiting without knowing
              when help will arrive can make the situation even harder.
            </p>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              RoadsRiser aims to bring these pieces together in one connected
              experience — helping drivers request assistance, discover
              nearby mechanics and stay informed while help is on the way.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {features.map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Icon />
                    </div>

                    <h3 className="mt-4 font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {item.text}
                    </p>

                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          VALUES
      ========================================================= */}
      <section className="bg-slate-900 py-24 text-white dark:bg-black">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              What We Believe
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Built around drivers.
              Built around trust.
            </h2>

            <p className="mt-5 text-slate-400">
              Every part of RoadsRiser starts with making roadside assistance
              a better experience.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {values.map((value) => {

              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-500 hover:-translate-y-2 hover:bg-white/[0.08]"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 transition group-hover:scale-110">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {value.description}
                  </p>

                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          PREMIUM FOUNDER SPOTLIGHT
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 py-28 text-white">

        {/* Background glow */}
        <div className="absolute left-[-180px] top-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="absolute right-[-180px] bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />

        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

          {/* Section heading */}
          <div className="mb-14 text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
              <FiUsers />
              The Person Behind RoadsRiser
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl lg:text-6xl">
              Meet the
              <span className="text-blue-400">
                {" "}Founder.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-slate-400">
              A vision to turn a real roadside problem into a technology-driven
              assistance platform.
            </p>

          </div>

          {/* Main Founder Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

            {/* top gradient */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">

              {/* =================================================
                  FOUNDER IMAGE
              ================================================= */}
              <div className="relative flex min-h-[580px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 p-10">

                {/* Grid background */}
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />

                {/* Glow behind image */}
                <div className="absolute h-[350px] w-[350px] rounded-full bg-blue-500/20 blur-3xl" />

                {/* Decorative orbit */}
                <div className="absolute h-[390px] w-[390px] rounded-full border border-blue-400/20" />

                <div className="absolute h-[450px] w-[450px] rounded-full border border-white/[0.06]" />

                {/* Orbit dots */}
                <div className="absolute h-[390px] w-[390px] animate-[spin_18s_linear_infinite] rounded-full">
                  <span className="absolute -top-1 left-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />

                  <span className="absolute bottom-10 right-5 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                </div>

                {/* Founder */}
                <div className="relative">

                  {/* Outer glow */}
                  <div className="absolute -inset-8 rounded-full bg-blue-500/20 blur-2xl" />

                  {/* Image frame */}
                  <div className="relative rounded-full border border-white/20 bg-gradient-to-br from-blue-400/30 to-transparent p-2 shadow-2xl">

                    <div className="rounded-full border-4 border-white/10 p-2">

                      <img
                        src={founderImg}
                        alt="Pravin Kumar - Founder of RoadsRiser"
                        className="h-64 w-64 rounded-full object-cover object-center shadow-2xl sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                      />

                    </div>
                  </div>

                  {/* Founder badge */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-blue-300/20 bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_40px_rgba(37,99,235,0.4)]">
                    Founder & CEO
                  </div>

                </div>

                {/* Floating mini card */}
                <div className="absolute left-6 top-8 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl sm:block">
                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                      <FiCheckCircle />
                    </span>

                    <div>
                      <p className="text-xs font-bold">
                        Building
                      </p>
                      <p className="text-[10px] text-slate-400">
                        RoadsRiser
                      </p>
                    </div>

                  </div>
                </div>

                {/* Floating location card */}
                <div className="absolute bottom-8 right-6 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl sm:block">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                      <FiMapPin />
                    </span>

                    <div>
                      <p className="text-xs font-bold">
                        Mathura
                      </p>

                      <p className="text-[10px] text-slate-400">
                        India
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* =================================================
                  FOUNDER CONTENT
              ================================================= */}
              <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">

                <div>

                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                    Founder Story
                  </span>

                  <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                    Pravin Kumar
                  </h3>

                  <p className="mt-3 text-lg font-medium text-blue-400">
                    Founder & CEO · RoadsRiser
                  </p>

                  <div className="mt-8 h-px w-full bg-gradient-to-r from-blue-500/50 via-white/10 to-transparent" />

                  <p className="mt-8 text-lg leading-8 text-slate-300">
                    RoadsRiser started with a simple thought:
                    <span className="font-semibold text-white">
                      {" "}getting stuck on the road shouldn't mean being left
                      without reliable help.
                    </span>
                  </p>

                  <p className="mt-5 leading-7 text-slate-400">
                    The vision is to combine modern technology with a
                    dependable mechanic network to create a smoother roadside
                    assistance experience for drivers.
                  </p>

                  <p className="mt-5 leading-7 text-slate-400">
                    From finding nearby assistance to tracking help in real
                    time, RoadsRiser is being built around one goal — making
                    the journey back to the road simpler.
                  </p>

                </div>

                {/* Founder info */}
                <div className="mt-10 grid gap-3 sm:grid-cols-2">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Education
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      B.Tech CSE
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      GLA University, Mathura
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Focus
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      Roadside Technology
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Connecting people with help
                    </p>
                  </div>

                </div>

                {/* Social + CTA */}
                <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex gap-3">

                    <a
                      href="https://www.facebook.com/share/1FaUBUAXFc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="group flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-blue-400/50 hover:bg-blue-500/10"
                    >
                      <img
                        src={facebookIcon}
                        alt="Facebook"
                        className="h-5 w-5 object-contain opacity-70 transition group-hover:opacity-100"
                      />
                    </a>

                    <a
                      href="https://www.instagram.com/pravinn._07?igsh=NHN6NTV6Zjh5ZW40"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="group flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-pink-400/50 hover:bg-pink-500/10"
                    >
                      <img
                        src={instagramIcon}
                        alt="Instagram"
                        className="h-5 w-5 object-contain opacity-70 transition group-hover:opacity-100"
                      />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/pravin9389"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="group flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-blue-400/50 hover:bg-blue-500/10"
                    >
                      <img
                        src={linkedinIcon}
                        alt="LinkedIn"
                        className="h-5 w-5 object-contain opacity-70 transition group-hover:opacity-100"
                      />
                    </a>

                  </div>

                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-3 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
                  >
                    Connect With Me
                    <FiArrowRight className="transition group-hover:translate-x-1" />
                  </Link>

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VISION
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">

        <div className="relative overflow-hidden rounded-[2rem]">

          <img
            src={verifiedsecurepayment}
            alt="RoadsRiser vision"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-slate-950/80" />

          <div className="relative px-8 py-20 text-center text-white sm:px-14">

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
              Our Vision
            </span>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black sm:text-5xl lg:text-6xl">
              A world where a roadside breakdown doesn't have to mean
              <span className="text-blue-400">
                {" "}being stranded.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-7 text-slate-300">
              RoadsRiser is working towards a connected roadside assistance
              ecosystem where technology helps drivers reach the right help
              at the right time.
            </p>

          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 px-6 py-24 text-center text-white">

        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          <h2 className="text-4xl font-black sm:text-6xl">
            Your journey matters.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-blue-100">
            When the unexpected happens, RoadsRiser is here to help you
            take the next step.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/request-help"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-blue-700 shadow-xl transition hover:-translate-y-1"
            >
              Request Assistance
              <FiArrowRight />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold backdrop-blur-xl transition hover:bg-white/20"
            >
              Contact RoadsRiser
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}