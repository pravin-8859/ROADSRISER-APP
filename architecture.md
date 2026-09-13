# 🏗️ RoadsRiser — System Architecture

## 1. Architecture Overview

RoadsRiser follows a modular full-stack client-server architecture.

The platform consists of three primary applications:

1. User-facing web application
2. Mechanic-facing application
3. Admin dashboard

These applications communicate with a centralized backend REST API.

The backend manages:

- Authentication
- Authorization
- Users
- Mechanics
- Service requests
- Request lifecycle
- Pricing
- Notifications
- Earnings
- Database operations

---

## 2. High-Level Architecture

```text
                              INTERNET
                                  │
                                  │ HTTPS
                                  ▼
                  ┌──────────────────────────────┐
                  │       ROADS RISER DOMAIN     │
                  │       roadsriser.in           │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │       USER WEB APPLICATION   │
                  │                              │
                  │       React + Vite           │
                  │                              │
                  │  • Authentication            │
                  │  • Service Requests          │
                  │  • Location                  │
                  │  • Request Tracking           │
                  │  • History                   │
                  └──────────────┬───────────────┘
                                 │
                                 │ HTTPS / REST API
                                 ▼
                  ┌──────────────────────────────┐
                  │          BACKEND API         │
                  │                              │
                  │       Node.js + Express      │
                  │                              │
                  │  • Authentication            │
                  │  • Authorization             │
                  │  • Request Management        │
                  │  • Pricing                   │
                  │  • Mechanic Operations       │
                  │  • Notifications             │
                  └──────────────┬───────────────┘
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                     ▼                       ▼
          ┌─────────────────────┐   ┌─────────────────────┐
          │      MongoDB        │   │   Email Provider    │
          │    MongoDB Atlas    │   │      Brevo API      │
          │                     │   │                     │
          │ • Users             │   │ • OTP emails        │
          │ • Mechanics         │   │ • Transactional     │
          │ • Requests          │   │   communication     │
          │ • Notifications     │   │                     │
          └─────────────────────┘   └─────────────────────┘


                  ┌──────────────────────────────┐
                  │      ADMIN APPLICATION      │
                  │                              │
                  │       React + Vite           │
                  │                              │
                  └──────────────┬───────────────┘
                                 │
                                 │ HTTPS / REST API
                                 ▼
                         ┌───────────────┐
                         │  BACKEND API  │
                         └───────────────┘


                  ┌──────────────────────────────┐
                  │     MECHANIC APPLICATION    │
                  │                              │
                  │       React + Vite           │
                  │                              │
                  │  • Requests                  │
                  │  • Availability              │
                  │  • Location                  │
                  │  • Job Status                │
                  │  • Earnings                  │
                  └──────────────┬───────────────┘
                                 │
                                 │ HTTPS / REST API
                                 ▼
                         ┌───────────────┐
                         │  BACKEND API  │
                         └───────────────┘
