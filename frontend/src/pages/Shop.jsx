// src/pages/Shop.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiPhone,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiX,
  FiZap,
} from "react-icons/fi";

import petrolImg from "../assets/petrol.png";
import oilImg from "../assets/engine-oil.png";
import batteryImg from "../assets/battery.png";
import tireImg from "../assets/tire.png";
import toolKitImg from "../assets/tool-kit.png";

const products = [
  {
    id: 1,
    name: "Premium Petrol",
    category: "Fuel",
    price: "₹120 / L",
    description: "Emergency fuel delivery when you are stranded on the road.",
    img: petrolImg,
    tag: "Emergency",
  },
  {
    id: 2,
    name: "Engine Oil - 4L",
    category: "Oil",
    price: "₹850",
    description: "Quality engine oil for smooth and reliable performance.",
    img: oilImg,
    tag: "Popular",
  },
  {
    id: 3,
    name: "Car Battery",
    category: "Accessory",
    price: "₹3,200",
    description: "Reliable replacement battery for your vehicle.",
    img: batteryImg,
    tag: "Essential",
  },
  {
    id: 4,
    name: "Spare Tire",
    category: "Accessory",
    price: "₹2,000",
    description: "Road-ready spare tire for unexpected punctures.",
    img: tireImg,
    tag: "Essential",
  },
  {
    id: 5,
    name: "Repair Tool Kit",
    category: "Tools",
    price: "₹1,500",
    description: "Compact toolkit for basic roadside vehicle repairs.",
    img: toolKitImg,
    tag: "Road Ready",
  },
  {
    id: 6,
    name: "Diesel",
    category: "Fuel",
    price: "₹110 / L",
    description: "Emergency diesel delivery when you need it most.",
    img: petrolImg,
    tag: "Emergency",
  },
];

const categories = ["All", "Fuel", "Oil", "Tools", "Accessory"];

export default function Shop() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        filter === "All" || product.category === filter;

      const searchMatch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [filter, search]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-slate-950">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pb-28 lg:pt-40">

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

            {/* Hero content */}
            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                <FiShoppingBag size={14} />
                RoadsRiser Shop
              </div>

              <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl">
                Everything your
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  road may need.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Explore essential fuel, batteries, tires, engine oils and
                roadside tools — all designed around your journey.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  Explore Products
                  <FiArrowRight />
                </a>

                <Link
                  to="/request-help"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
                >
                  <FiZap />
                  Request Roadside Help
                </Link>

              </div>

              {/* Trust items */}
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <FiShield className="shrink-0 text-green-400" />
                  Trusted Quality
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <FiTruck className="shrink-0 text-blue-400" />
                  Delivery Support
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <FiClock className="shrink-0 text-yellow-400" />
                  Emergency Ready
                </div>

              </div>

            </div>

            {/* Hero visual */}
            <div className="mx-auto w-full max-w-[520px]">

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7">

                {/* Top */}
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      RoadRiser
                    </p>

                    <h3 className="mt-1 text-xl font-black text-white">
                      Road Essentials
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                    <FiPackage size={22} />
                  </div>

                </div>

                {/* Product visual */}
                <div className="mt-7 grid grid-cols-2 gap-4">

                  <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <img
                      src={batteryImg}
                      alt="Battery"
                      className="h-24 w-24 object-contain"
                    />

                    <p className="mt-3 text-xs font-semibold text-slate-300">
                      Battery
                    </p>
                  </div>

                  <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <img
                      src={tireImg}
                      alt="Tire"
                      className="h-24 w-24 object-contain"
                    />

                    <p className="mt-3 text-xs font-semibold text-slate-300">
                      Tire
                    </p>
                  </div>

                  <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <img
                      src={oilImg}
                      alt="Engine Oil"
                      className="h-24 w-24 object-contain"
                    />

                    <p className="mt-3 text-xs font-semibold text-slate-300">
                      Engine Oil
                    </p>
                  </div>

                  <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <img
                      src={toolKitImg}
                      alt="Tool Kit"
                      className="h-24 w-24 object-contain"
                    />

                    <p className="mt-3 text-xs font-semibold text-slate-300">
                      Tool Kit
                    </p>
                  </div>

                </div>

                {/* Bottom status */}
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green-400/10 bg-green-500/5 p-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                    <FiCheckCircle />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Road Ready
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Essential roadside supplies
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          BENEFITS
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="-mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Benefit
            icon={<FiShield />}
            title="Reliable Quality"
            text="Products selected for your vehicle"
          />

          <Benefit
            icon={<FiTruck />}
            title="Delivery Support"
            text="Help wherever you need it"
          />

          <Benefit
            icon={<FiZap />}
            title="Emergency Ready"
            text="Designed for roadside situations"
          />

          <Benefit
            icon={<FiPhone />}
            title="Need Assistance?"
            text="RoadRiser support is nearby"
          />

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >

        {/* Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              Our Collection
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Road essentials.
            </h2>

            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Choose a category or search for exactly what you need.
            </p>

          </div>

          {/* Search */}
          <div className="relative w-full lg:w-[320px]">

            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900"
            />

          </div>

        </div>

        {/* Category buttons */}
        <div className="mt-8 flex flex-wrap gap-3">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                filter === category
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {category}
            </button>

          ))}

        </div>

        {/* Product grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {filteredProducts.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              onQuote={() => setSelectedProduct(product)}
            />

          ))}

        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/10">

            <FiSearch
              size={38}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-5 text-xl font-bold">
              No products found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another product or category.
            </p>

          </div>
        )}

      </section>

      {/* =====================================================
          WHY ROADRISER SHOP
      ===================================================== */}
      <section className="bg-white py-24 dark:bg-slate-900/50">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
                Why RoadsRiser
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                More than a shop.
                <span className="block text-blue-600 dark:text-blue-400">
                  It's roadside support.
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-500 dark:text-slate-400">
                RoadsRiser combines essential products with roadside
                assistance, so you don't have to figure everything out alone
                when something goes wrong.
              </p>

              <div className="mt-8 space-y-5">

                <FeatureRow text="Get essential vehicle products" />
                <FeatureRow text="Request roadside assistance directly" />
                <FeatureRow text="Connect with verified mechanics" />
                <FeatureRow text="Track your assistance request" />

              </div>

            </div>

            {/* Stats / visual */}
            <div className="grid grid-cols-2 gap-4">

              <StatBox
                number="24/7"
                label="Roadside Support"
              />

              <StatBox
                number="100%"
                label="Customer Focus"
              />

              <StatBox
                number="Fast"
                label="Assistance"
              />

              <StatBox
                number="Secure"
                label="Experience"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 px-7 py-16 text-center text-white sm:px-12">

          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
              Need More Than A Product?
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Stranded on the road?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
              Skip the hassle. Request roadside assistance and let RoadsRiser
              connect you with the right help.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/request-help"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-xl transition hover:-translate-y-1"
              >
                Request Assistance
                <FiArrowRight />
              </Link>

              <a
                href="tel:+919389867581"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 font-bold text-white transition hover:bg-white/20"
              >
                <FiPhone />
                Call Us
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUOTE MODAL
      ===================================================== */}
      {selectedProduct && (
        <ComingSoonModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </main>
  );
}

/* =============================================================
   BENEFIT
============================================================= */

function Benefit({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          {icon}
        </div>

        <div className="min-w-0">

          <h3 className="truncate font-bold">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   PRODUCT CARD
============================================================= */

function ProductCard({ product, onQuote }) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">

      {/* Image area */}
      <div className="relative flex h-60 items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_65%)]" />

        <span className="absolute left-5 top-5 z-10 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
          {product.tag}
        </span>

        <img
          src={product.img}
          alt={product.name}
          className="relative h-44 w-44 object-contain drop-shadow-xl transition duration-500 group-hover:scale-105"
        />

      </div>

      {/* Details */}
      <div className="p-6">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {product.category}
            </p>

            <h3 className="mt-1 truncate text-xl font-black">
              {product.name}
            </h3>

          </div>

          <div className="flex shrink-0 items-center gap-1 text-xs text-yellow-500">
            <FiStar className="fill-current" />
            <span className="font-semibold text-slate-400">
              4.8
            </span>
          </div>

        </div>

        <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500 dark:text-slate-400">
          {product.description}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4">

          <div className="min-w-0">

            <p className="text-xs text-slate-400">
              Starting from
            </p>

            <p className="mt-1 truncate text-2xl font-black">
              {product.price}
            </p>

          </div>

          <button
            onClick={onQuote}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20"
          >
            Order Soon
            <FiArrowRight size={15} />
          </button>

        </div>

      </div>

    </article>
  );
}

/* =============================================================
   FEATURE ROW
============================================================= */

function FeatureRow({ text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
        <FiCheck size={16} />
      </div>

      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {text}
      </span>

    </div>
  );
}

/* =============================================================
   STAT BOX
============================================================= */

function StatBox({ number, label }) {
  return (
    <div className="flex min-h-[170px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-slate-950">

      <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
        {number}
      </p>

      <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>

    </div>
  );
}

/* =============================================================
   COMING SOON MODAL
============================================================= */

function ComingSoonModal({ product, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl dark:bg-slate-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Top visual */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 px-7 pb-8 pt-9 text-center text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
          >
            <FiX size={19} />
          </button>

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-cyan-200 shadow-lg ring-1 ring-white/10">
            <FiShoppingBag size={29} />
          </div>

          <p className="relative mt-5 text-xs font-black uppercase tracking-[0.25em] text-blue-200">
            RoadsRiser Shop
          </p>

          <h2
            id="coming-soon-title"
            className="relative mt-2 text-3xl font-black tracking-tight"
          >
            Ordering is coming soon
          </h2>

          <p className="relative mx-auto mt-3 max-w-sm text-sm leading-6 text-blue-100"
          >
            We’re preparing secure ordering and delivery so you can buy
            roadside essentials directly through RoadsRiser.
          </p>
        </div>

        {/* Product preview */}
        <div className="p-7">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/70">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900">
              <img
                src={product.img}
                alt={product.name}
                className="h-12 w-12 object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {product.category}
              </p>
              <h3 className="mt-1 truncate font-black text-slate-900 dark:text-white">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {product.price}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <FeatureRow text="Online ordering is being prepared" />
            <FeatureRow text="Secure payment & delivery will be added" />
            <FeatureRow text="RoadRiser roadside assistance is already available" />
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 py-3 font-bold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Continue Browsing
            </button>

            <a
              href="tel:+919389867581"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-500"
            >
              <FiPhone />
              Contact Us
            </a>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            No order or payment has been placed.
          </p>
        </div>
      </div>
    </div>
  );
}