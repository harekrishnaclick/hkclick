# Overview

Cosmic-themed spiritual clicking game (popcat.click style) with multiple deity pages. Features include alternating button clicking, mala counting (108-point cycles), global leaderboard with user authentication, MongoDB Atlas persistence, PWA support, and a hamburger menu for navigation/login.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: SPA using React 18 with TypeScript
- **Vite Build System**: Fast dev server and optimized production builds
- **shadcn/ui Component Library**: UI components built on Radix UI + Tailwind CSS
- **TanStack Query**: Data fetching with caching for leaderboard data
- **Wouter Router**: Client-side routing for deity pages (`/krishna`, `/radha`, `/rama`, etc.)
- **Tailwind CSS**: Utility-first CSS with cosmic glassmorphism theme

## Page Structure
- **Multiple Deity Pages**: 11 deity/spiritual figure pages, each using the reusable `DeityGame` component with unique config
  - Deities: Krishna, Radha, Rama, Shivji, Hanuman, Ganesh, Durga, Sai Baba, Guru Nanak, Buddha, Mahavir
  - Routes: `/{deityKey}` (e.g., `/krishna`, `/radha`, `/shivji`)
  - `/` redirects to `/krishna`
- **Config-driven**: All deity configs defined in `client/src/lib/deityConfigs.ts`

## Key Components
- **DeityGame** (`client/src/components/DeityGame.tsx`): Reusable game component accepting deity config (name, button labels, colors, background, sounds)
- **HamburgerMenu** (`client/src/components/HamburgerMenu.tsx`): Glassmorphic slide-in menu with deity navigation links, login/logout, mute toggle
- **AuthModal** (`client/src/components/AuthModal.tsx`): Controlled dialog for login/registration
- **Leaderboard** (`client/src/components/Leaderboard.tsx`): Global + country leaderboard with score submission
- **Collapsible Mala Counter**: Built into DeityGame, tracks 108-pair cycles with progress bar

## State Management
- **Auth state**: Lifted to App level, shared across all pages via props, persisted in localStorage
- **Mute state**: App-level, passed to HamburgerMenu and DeityGame, persisted in localStorage
- **Game state**: Per-page in DeityGame component (score, mala count, expecting button)

## Backend Architecture
- **Express.js Server**: RESTful API for auth and leaderboard
- **MongoDB Atlas**: Primary database via `mongoStorage`
- **Routes**: `/api/auth/login`, `/api/auth/register`, `/api/leaderboard/score`, `/api/leaderboard/global`, `/api/leaderboard/country/:country`, `/api/leaderboard/total`

## PWA Support
- **manifest.json**: App manifest with SVG icons (icon-192.svg, icon-512.svg)
- **sw.js**: Service worker with network-first + cache fallback strategy
- **Meta tags**: iOS/Android install support in index.html

## Build and Deployment
- **Production Build**: Vite (client) + esbuild (server)
- **Docker**: docker-compose files available for deployment
- **Static Asset Serving**: Express serves built client assets in production

# External Dependencies

## Database
- **MongoDB Atlas**: Cloud MongoDB database via `MONGODB_URI` env var

## UI and Styling
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: With cosmic theme colors (cosmic-purple, golden, deep-space, mystic-purple)
- **Lucide React**: Icon library
- **Google Fonts**: Orbitron + Space Grotesk

## Key Packages
- **TanStack Query v5**: Server state (object-form API only)
- **wouter**: Client routing with Redirect support
- **Zod**: Request validation on backend
