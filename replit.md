# Advanced Screen Recorder

## Overview

This is a modern web-based screen recording application built with React and TypeScript that provides advanced screen capture capabilities with DRM content recording support. The application features a clean, intuitive interface for recording screen content with customizable audio settings, quality controls, and browser compatibility features. It uses a full-stack architecture with Express.js backend and React frontend, storing recording metadata in a PostgreSQL database via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling and development
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing (lightweight React Router alternative)
- **State Management**: TanStack Query (React Query) for server state and API data management
- **Form Handling**: React Hook Form with Zod for validation
- **Styling**: Tailwind CSS with CSS variables for theming and custom design system

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Development Setup**: Custom Vite integration for hot module replacement in development
- **API Design**: RESTful API with proper error handling and request/response logging
- **Storage Interface**: Abstract storage interface with in-memory implementation (MemStorage) for development

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL with Neon serverless database support
- **Schema Management**: Centralized schema definitions in `/shared` directory with Zod integration
- **Migrations**: Drizzle Kit for schema migrations and database management

### Key Features Implementation
- **Screen Recording**: Native browser MediaRecorder API with getDisplayMedia for screen capture
- **Audio Management**: Support for system audio and microphone input with volume controls
- **Recording Settings**: Configurable video quality (1080p/720p/480p) and frame rates (24/30/60 FPS)
- **File Management**: Recording metadata storage with file size, duration, and format tracking
- **Browser Compatibility**: Cross-browser support with Chrome optimization for DRM content

### Project Structure
- **Monorepo Layout**: Client, server, and shared code in single repository
- **Shared Types**: Common TypeScript types and Zod schemas in `/shared` directory
- **Component Organization**: Feature-based component structure with reusable UI components
- **Asset Management**: Vite asset pipeline with TypeScript path mapping

## External Dependencies

### Core Framework Dependencies
- **@vitejs/plugin-react**: Vite React plugin for JSX compilation and fast refresh
- **express**: Web application framework for the Node.js backend server
- **wouter**: Minimalist routing library for React single-page applications

### Database and ORM
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support for PostgreSQL
- **drizzle-kit**: CLI tool for schema management and database migrations
- **@neondatabase/serverless**: Serverless PostgreSQL database client for Neon platform

### UI and Styling
- **@radix-ui/react-***: Comprehensive collection of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Utility for creating component variants with conditional styling
- **tailwind-merge**: Utility for merging Tailwind CSS classes without conflicts

### State Management and API
- **@tanstack/react-query**: Powerful data synchronization library for React applications
- **react-hook-form**: Performant forms library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form integration
- **zod**: TypeScript-first schema validation library

### Development and Build Tools
- **typescript**: Static type checking for JavaScript with excellent tooling support
- **vite**: Next-generation frontend build tool with fast HMR and optimized builds
- **tsx**: TypeScript execution engine for Node.js development server
- **esbuild**: Fast JavaScript bundler and minifier for production builds

### Recording and Media APIs
- **Native Web APIs**: MediaRecorder, getDisplayMedia, getUserMedia for screen and audio capture
- **File Handling**: Blob API for recording data management and export functionality