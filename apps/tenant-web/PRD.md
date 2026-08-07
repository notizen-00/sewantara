PRD
Sewantara Public Tenant Website

Version: 1.0

Overview

Nama Project

Sewantara Public Tenant Website

Repository

sewantara-tenant-web

Framework

Nuxt 4

Type

SSR Multi Tenant Website

Target

Customer yang ingin melakukan booking secara online.

Website ini akan otomatis berubah berdasarkan subdomain tenant.

Contoh

kamerajember.sewantara.id

mobilbali.sewantara.id

psarena.sewantara.id

tendanikah.sewantara.id

Semua website menggunakan satu source code.

Goals

Menyediakan website profesional untuk setiap tenant tanpa perlu membuat website sendiri.

Setiap tenant memperoleh

Landing Page
Catalog
Booking
Checkout
Payment
Tracking
SEO
Mobile Friendly
Target User
Customer

Melihat produk

Booking

Bayar

Tracking

Review

Guest

Melihat katalog

Search

Kontak

Core Features
Home

Hero

Search

Featured Product

Category

Promotion

Testimonial

FAQ

CTA

Catalog

List Product

Filter

Sort

Search

Availability

Infinite Scroll

Product Detail

Gallery

Description

Price

Availability

Location

Booking Calendar

Related Product

Review

Booking

Choose Date

Choose Time

Quantity

Duration

Extra Service

Coupon

Notes

Checkout

Customer Info

Payment Method

Summary

Agreement

Pay Now

Payment

Waiting Payment

Success

Failed

Expired

Retry

Booking Status

Upcoming

Reserved

Processing

Completed

Cancelled

Customer Profile

Booking History

Invoice

Wishlist

Notification

Review

Contact

WhatsApp

Google Maps

Email

Social Media

Blog

SEO Article

Promotion

News

Non Functional Requirement

SEO Ready

SSR

Fast

Responsive

Core Web Vital

Accessibility

Offline Cache

Image Optimization

Structured Data

Lazy Loading

SEO

Generate

Meta

OG

Twitter

JSON LD

Canonical

Sitemap

robots.txt

Dynamic Meta

Dynamic Branding

Logo

Primary Color

Secondary Color

Font

Hero

Banner

Favicon

Business Name

Domain

Semua berasal dari API.

Theme System

Light

Dark

Custom Color

Per Tenant

Multi Tenant Flow
Customer

↓

kamerajember.sewantara.id

↓

Nuxt Middleware

↓

Tenant Resolver

↓

API

↓

Laravel

↓

Stancl Tenancy

↓

Database Tenant
Folder Structure
app/
components/
layouts/
pages/
middleware/
plugins/
stores/
composables/
services/
types/
utils/
server/
assets/
public/
Routing
/

catalog

catalog/[slug]

booking

checkout

payment

tracking

about

contact

blog

blog/[slug]

login

register

profile

profile/booking

profile/review
API Layer

Semua komunikasi hanya ke

https://api.sewantara.id

Tidak ada logic bisnis di Nuxt.

Authentication

Guest

Customer Login

Google Login

OTP Login

Magic Link (Future)

Payment

Xendit

Midtrans

Tripay

(tergantung tenant)

Notification

Email

WhatsApp

Firebase

Browser Push

Localization

Indonesia

English

Future

State Management

Pinia

UI Framework

TailwindCSS

Shadcn Vue

Image

Nuxt Image

Cloudflare Image

Cache

Nitro Cache

CDN

Browser Cache

Analytics

Google Analytics

Google Tag Manager

Meta Pixel

TikTok Pixel

Per Tenant

Error Page

404

500

Maintenance

Tenant Suspended

Subscription Expired

Performance Target

LCP < 2s

CLS < 0.1

INP < 200ms

Lighthouse >95

Tech Stack
Framework

Nuxt 4

Vue 3

TypeScript

Nitro

SSR

Styling

TailwindCSS

Shadcn Vue

VueUse Motion

Iconify

State

Pinia

Pinia Persist

Validation

Zod

VeeValidate

HTTP

ofetch

Nuxt useFetch

Form

VeeValidate

Image

Nuxt Image

Cloudinary (optional)

Charts

Chart.js

Date

dayjs

Utilities

VueUse

lodash-es

Markdown

Nuxt Content

Animation

Motion

GSAP

Loading

NProgress

Skeleton Loader

Icons

Iconify

Fonts

Geist

Inter

SEO

Nuxt SEO

Nuxt Sitemap

Nuxt Robots

JSON LD

Authentication

JWT

Laravel Sanctum

Refresh Token

Storage

Cookie

Session

LocalStorage

Testing

Vitest

Playwright

ESLint

Prettier

Environment
NUXT_PUBLIC_APP_NAME=Sewantara

NUXT_API_BASE=https://api.sewantara.id

NUXT_PUBLIC_BASE_URL=https://sewantara.id

NUXT_PUBLIC_CDN=

NUXT_PUBLIC_GA=

NUXT_PUBLIC_GTM=
Deployment

Docker

PM2

Node 22 LTS

Nginx Proxy Manager

Cloudflare

Wildcard SSL

Future Features

PWA

AI Recommendation

Realtime Stock

Live Chat

Marketplace

Affiliate

Membership

Referral

QR Pickup

Loyalty Point

Architecture
Cloudflare
│
\*.sewantara.id / sewantara.id
│
Nginx Proxy Manager
│
Nuxt SSR (Node/Nitro)
│
Tenant Middleware
│
Server API (BFF)
│
api.sewantara.id
│
Laravel 12 API
│
Stancl Tenancy
│
┌────────────────┴────────────────┐
│ │
Central Database Tenant Database
Tech Stack Final (yang saya rekomendasikan)

Karena ini akan menjadi wajah publik setiap tenant dan sangat bergantung pada SEO, performa, dan skalabilitas, saya merekomendasikan stack berikut:

Layer Technology
Framework Nuxt 4 (SSR + Nitro)
Language TypeScript
UI Vue 3 Composition API
Styling Tailwind CSS v4
Component shadcn-vue
State Pinia
Forms VeeValidate + Zod
HTTP ofetch + useFetch
Images Nuxt Image
SEO Nuxt SEO, Sitemap, Robots, JSON-LD
Animations Motion Vue (untuk micro interaction), GSAP (opsional untuk hero section)
Auth Laravel Sanctum / JWT via BFF
Deployment Docker + PM2
Reverse Proxy Nginx Proxy Manager
CDN & DNS Cloudflare
Backend Laravel 12 + Stancl Tenancy + laravelcm/laravel-subscriptions
Satu rekomendasi tambahan

Saya juga menyarankan agar Nuxt tidak berkomunikasi langsung dengan Laravel dari browser, tetapi menggunakan pola Backend for Frontend (BFF) melalui server/api Nuxt.

Alurnya menjadi:

Browser
│
▼
Nuxt SSR (BFF)
│
▼
api.sewantara.id
│
▼
Laravel Tenancy

Dengan pola ini Anda mendapatkan:

Tidak perlu mengatur CORS yang rumit.
Cookie dan session lebih aman.
Header tenant (X-Tenant) dapat disisipkan oleh server Nuxt, bukan browser.
API internal tidak terekspos langsung ke klien.
Lebih mudah melakukan caching SSR, rate limiting, dan optimasi performa.
