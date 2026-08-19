// src/pages/Contact.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
  FiShield,
  FiTwitter,
  FiZap,
} from "react-icons/fi";

import verifiedsecurepayment from "../assets/verifiedsecurepayment.jpg";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Current frontend flow.
    // Backend contact API can be connected here later.
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  };

  const contactItems = [
    {
      icon: FiPhone,
      title: "Call Us",
      value: "+91 9389867581",
      description: "Available for assistance",
    },
    {
      icon: FiMail,
      title: "Email Us",
      value: "praviiiinn@gmail.com",
      description: "We'll respond as soon as possible",
    },
    {
      icon: FiMapPin,
      title: "Our Base",
      value: "Mathura, India",
      description: "Expanding to more cities",
    },
  ];

  const socialLinks = [
    {
      icon: FiInstagram,
      label: "Instagram",
      href: "https://www.instagram.com/pravinn._07",
    },
    {
      icon: FiLinkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/pravin9389",
    },
    {
      icon: FiGithub,
      label: "GitHub",
      href: "https://github.com/pravin-8859",
    },
    {
      icon: FiTwitter,
      label: "X",
      href: "https://x.com",
    },
  ];

  return (
    <main className="overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-28 text-white sm:py-36">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(37,99,235,0.28),transparent_35%)]" />

        <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
              <FiMessageCircle />
              GET IN TOUCH
            </span>

            <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Let's talk about
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                your next journey.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Have a question, need roadside assistance, or want to know more
              about RoadsRiser? Send us a message and we'll get back to you.
            </p>

            <div className="mt-9 flex flex-wrap gap-6 text-sm text-slate-400">

              <span className="flex items-center gap-2">
                <FiClock className="text-blue-400" />
                24/7 Assistance
              </span>

              <span className="flex items-center gap-2">
                <FiShield className="text-green-400" />
                Secure Experience
              </span>

              <span className="flex items-center gap-2">
                <FiZap className="text-yellow-400" />
                Quick Response
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          CONTACT CARDS
      ========================================================= */}
      <section className="relative mx-auto -mt-12 max-w-7xl px-6 lg:px-8">

        <div className="grid gap-5 md:grid-cols-3">

          {contactItems.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/40 transition duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20"
              >

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {item.title}
                    </p>

                    <p className="mt-1 font-bold">
                      {item.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* =========================================================
          MAIN CONTACT AREA
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">

          {/* LEFT INFORMATION */}
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl sm:p-10">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative">

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                Contact RoadsRiser
              </span>

              <h2 className="mt-5 text-4xl font-black leading-tight">
                We're here to
                <span className="block text-blue-400">
                  help.
                </span>
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                Whether you're a driver looking for assistance or someone
                interested in RoadsRiser, we'd love to hear from you.
              </p>

              {/* Feature list */}
              <div className="mt-10 space-y-5">

                {[
                  "Roadside assistance support",
                  "Questions about our services",
                  "Mechanic partnership enquiries",
                  "General feedback and suggestions",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <FiCheckCircle />
                    </div>

                    <span className="text-sm text-slate-300">
                      {item}
                    </span>
                  </div>

                ))}

              </div>

              {/* Emergency block */}
              <div className="mt-10 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                    <FiPhone />
                  </div>

                  <div>
                    <p className="font-bold">
                      Need roadside help?
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Don't wait. Request assistance directly.
                    </p>

                    <Link
                      to="/request-help"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-400"
                    >
                      Request Help
                      <FiArrowRight />
                    </Link>
                  </div>

                </div>

              </div>

              {/* Social */}
              <div className="mt-10">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Follow RoadsRiser
                </p>

                <div className="mt-4 flex gap-3">

                  {socialLinks.map((social) => {

                    const Icon = social.icon;

                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Icon size={19} />
                      </a>
                    );
                  })}

                </div>

              </div>

            </div>
          </div>

          {/* =====================================================
              CONTACT FORM
          ===================================================== */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/30 sm:p-10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20">

            <div className="mb-8">

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
                Send a Message
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                How can we help?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Fill in the details below and tell us what you need.
              </p>

            </div>

            {/* Success */}
            {submitted && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">

                <FiCheckCircle className="mt-0.5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Message received!
                  </p>

                  <p className="mt-1 text-xs opacity-80">
                    Thank you for contacting RoadsRiser. We'll get back to
                    you soon.
                  </p>
                </div>

              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Pravin Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950"
                  />
                </div>

              </div>

              {/* Phone + Service */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    What do you need?
                  </label>

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950"
                  >
                    <option value="">
                      Select a service
                    </option>

                    <option value="mechanic">
                      Nearby Mechanic
                    </option>

                    <option value="towing">
                      Towing Assistance
                    </option>

                    <option value="battery">
                      Battery Assistance
                    </option>

                    <option value="fuel">
                      Fuel Delivery
                    </option>

                    <option value="emergency">
                      Emergency Assistance
                    </option>

                    <option value="partnership">
                      Mechanic Partnership
                    </option>

                    <option value="general">
                      General Enquiry
                    </option>
                  </select>
                </div>

              </div>

              {/* Message */}
              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Message
                </label>

                <textarea
                  name="message"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950"
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
              >
                Send Message
                <FiSend className="transition group-hover:translate-x-1" />
              </button>

              <p className="text-center text-xs text-slate-400">
                By submitting this form, you agree to be contacted regarding
                your enquiry.
              </p>

            </form>

          </div>

        </div>
      </section>

      {/* =========================================================
          MAP / COVERAGE
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">

        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 py-16 text-white sm:px-14">

          <img
            src={verifiedsecurepayment}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />

          <div className="absolute inset-0 bg-slate-950/75" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">

            <div>

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                Our Coverage
              </span>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Starting from
                <span className="block text-blue-400">
                  Mathura, India.
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                RoadsRiser is being built to expand roadside assistance to
                more cities and make reliable help easier to access.
              </p>

              <div className="mt-7 flex items-center gap-3 text-sm text-slate-300">

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <FiMapPin />
                </span>

                Mathura, Uttar Pradesh, India

              </div>

            </div>

            {/* Map-style visual */}
            <div className="relative h-72 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:35px_35px]" />

              <div className="absolute left-[48%] top-[45%]">

                <div className="absolute -inset-10 animate-ping rounded-full bg-blue-500/10" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.6)]">
                  <FiMapPin size={25} />
                </div>

              </div>

              <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">

                <p className="text-xs font-bold">
                  RoadsRiser
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Coverage expanding
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 px-6 py-24 text-center text-white">

        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          <h2 className="text-4xl font-black sm:text-6xl">
            Need help on the road?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-blue-100">
            Don't let a roadside problem stop your journey. Request
            assistance and get connected with help.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/request-help"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-blue-700 shadow-2xl transition hover:-translate-y-1"
            >
              Request Assistance
              <FiArrowRight className="transition group-hover:translate-x-1" />
            </Link>

            <a
              href="tel:+919389867581"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold backdrop-blur-xl transition hover:bg-white/20"
            >
              <FiPhone />
              Call Us
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}