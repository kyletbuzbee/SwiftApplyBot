# Overview

JobFlow is a comprehensive job search automation platform built with React and Express. The application helps users automate their job application process by providing tools for job discovery, application tracking, profile management, and analytics. It features a modern dashboard interface for managing job applications across multiple platforms like LinkedIn, Indeed, and Glassdoor.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite as the build tool. It follows a component-based architecture with:

- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

The application uses a sidebar layout with main navigation and responsive design. Components are organized into feature-based modules (dashboard, applications, jobs, etc.) with shared UI components.

## Backend Architecture
The backend is an Express.js REST API with TypeScript:

- **Server Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for CRUD operations
- **Development Setup**: Vite middleware integration for hot reloading
- **Error Handling**: Centralized error middleware
- **Logging**: Custom request/response logging middleware

## Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for schema migrations

The schema includes tables for users, jobs, applications, job platforms, user profiles, and application tracking.

## Authentication & Session Management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **User Management**: Basic user profile system with skills, experience, and preferences

## External Service Integrations
The application is designed to integrate with multiple job platforms through automated scraping and application services:

- **Job Scraping**: Puppeteer/Playwright integration for scraping job listings
- **Auto-Apply**: Automated job application submission
- **Platform APIs**: Integration points for LinkedIn, Indeed, and Glassdoor

# External Dependencies

## Core Technologies
- **React 18**: Frontend framework with hooks and context
- **Express.js**: Backend web framework
- **TypeScript**: Type safety across the entire stack
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

## Database & ORM
- **PostgreSQL**: Primary database (Neon serverless)
- **Drizzle ORM**: Type-safe database toolkit
- **Drizzle Kit**: Schema management and migrations

## UI Components & Styling
- **Radix UI**: Headless UI primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

## State Management & Forms
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation

## Automation & Scraping
- **Puppeteer/Playwright**: Browser automation for job scraping and auto-apply
- **Date-fns**: Date manipulation utilities

## Development Tools
- **ESBuild**: Production bundling
- **PostCSS**: CSS processing
- **Replit Development**: Replit-specific development tools and error handling