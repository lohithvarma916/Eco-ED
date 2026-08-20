# Eco-ED - Interactive Environmental Education Platform

## Overview

Eco-ED is a comprehensive full-stack web application designed for interactive and gamified environmental education. The platform serves both students and teachers, offering story-driven adventure modes, community challenges, and comprehensive progress tracking. The application features role-based dashboards, real-time collaboration tools, and gamification mechanics to motivate sustainable behaviors and educational engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful APIs with role-based access control
- **Middleware**: Custom logging, error handling, and authentication middleware
- **File Structure**: Monorepo structure with shared types between client and server

### Authentication System
- **Provider**: Replit's OpenID Connect (OIDC) authentication
- **Session Management**: Express sessions with PostgreSQL session store
- **Authorization**: Role-based access control (students vs teachers)
- **Security**: JWT tokens with secure HTTP-only cookies

### Database Architecture
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection**: Connection pooling with @neondatabase/serverless

### Data Model Design
- **Users**: Role-based system (student/teacher) with gamification metrics
- **Educational Content**: Chapters, missions, and progress tracking
- **Community Features**: Forum posts, challenges, and submissions
- **Gamification**: Points, levels, experience, achievements, and leaderboards
- **Analytics**: Progress tracking and performance metrics for dashboards

### Gamification System
- **Progress Tracking**: Experience points, levels, and completion percentages
- **Achievement System**: Badge collection with various categories
- **Social Features**: Leaderboards and community challenges
- **Rewards**: Point-based system with potential for partner integrations

### UI/UX Architecture
- **Design System**: Consistent theming with role-specific color schemes
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: ARIA labels and keyboard navigation support
- **Component Library**: Modular, reusable components with proper TypeScript typing

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OIDC authentication service
- **Hosting**: Designed for Replit deployment environment

### Frontend Libraries
- **UI Framework**: React with Radix UI primitives for accessible components
- **State Management**: TanStack React Query for API state synchronization
- **Styling**: Tailwind CSS with PostCSS for processing
- **Form Handling**: React Hook Form with Hookform resolvers for validation
- **Icons**: Font Awesome and Lucide React for iconography

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database ORM**: Drizzle ORM with PostgreSQL adapter
- **Session Storage**: connect-pg-simple for PostgreSQL session management
- **Validation**: Zod for runtime type validation and schema generation
- **Authentication**: Passport.js with OpenID Connect strategy

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Type Checking**: TypeScript with strict mode enabled
- **Code Quality**: ESLint configuration for consistent code style
- **Development Server**: Hot module replacement with Vite dev server

### Potential Integrations
- **Environmental APIs**: Placeholder for NGO partnerships and eco-action validation
- **File Storage**: Attachment support for challenge submissions
- **Email Services**: Notification system for community interactions
- **Analytics**: User engagement and learning progress analytics