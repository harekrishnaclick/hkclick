# Overview

This is a full-stack web application built with React (frontend) and Express.js (backend), featuring a modern UI component library and database integration. The project demonstrates a monorepo structure with shared TypeScript schemas and follows modern development practices with Drizzle ORM for database management and shadcn/ui for the component system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Single-page application using React 18 with TypeScript for type safety
- **Vite Build System**: Modern build tool providing fast development server and optimized production builds
- **shadcn/ui Component Library**: Comprehensive UI component system built on Radix UI primitives with Tailwind CSS styling
- **TanStack Query**: State management and data fetching with caching, background updates, and error handling
- **Wouter Router**: Lightweight client-side routing solution
- **Tailwind CSS**: Utility-first CSS framework with custom design system configuration

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing, CORS, and error handling
- **TypeScript**: Full type safety across server-side code
- **Storage Layer Abstraction**: Interface-based storage system allowing multiple implementations (currently in-memory)
- **Modular Route System**: Organized API routes under `/api` prefix with centralized registration

## Data Management
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect configuration
- **Shared Schema**: Common TypeScript types and Zod validation schemas shared between frontend and backend
- **Database Migrations**: Automated migration system with Drizzle Kit
- **Validation Layer**: Input validation using Zod schemas derived from database schema

## Development Environment
- **Monorepo Structure**: Organized with separate `client`, `server`, and `shared` directories
- **Hot Reload**: Vite HMR for frontend and tsx for backend development
- **Path Aliases**: Simplified imports using TypeScript path mapping
- **ESM Modules**: Modern ES module system throughout the application

## Build and Deployment
- **Production Build**: Separate client (Vite) and server (esbuild) build processes
- **Static Asset Serving**: Express serves built client assets in production
- **Environment Configuration**: Environment variables for database connection and runtime configuration

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database with `@neondatabase/serverless` driver
- **Connection Pooling**: Built-in connection management through Neon's serverless driver

## UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Custom font loading for Orbitron, Space Grotesk, and other typefaces

## Development Tools
- **Replit Integration**: Development environment optimizations and runtime error handling
- **TypeScript Compiler**: Type checking and compilation
- **ESLint/Prettier**: Code formatting and linting (implied by project structure)

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod Resolvers**: Form validation integration with Zod schemas

## Build Tools
- **Vite**: Frontend build tool with plugin ecosystem
- **esbuild**: Backend bundling for production deployment
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer