# Development Standards & Architecture

## 1. Type Definitions

- **No Implicit Any:** Forbidden to use `any`. Always define interfaces or types.
- **Const Assertions:** Use `as const` for fixed configurations (Tables).
- **Discriminated Unions:** Used for handling UI states (e.g., `type State = { status: 'success', data: T } | { status: 'error', error: string }`).

## 2. Database & Supabase

- **Schema & Tables:**
  - **Source of Truth:** Always refer to the `schema.sql` file in the `supabase/database/migrations` directory for the definitive database schema.
  - **Table Naming:** Use the exact table names defined in `supabase/database/migrations` (e.g., `biofloc_thematic_programs`, `minapadi_thematic_programs`).
  - **Column Names:** Use the exact column names from the schema (e.g., `progress_percent`, `distribution_amount`).
  - **Enums:** Use the exact enum values defined in the schema (e.g., `biofloc_thematic`, `minapadi_thematic`, `isf`).
- **Data Fetching:**
  - **Server Actions:** Use server actions for all database operations.
  - **Type Safety:** Always parse and validate data from Supabase using Zod schemas to ensure type safety.
  - **Error Handling:** Always handle potential errors from Supabase operations.
- **Security:**
  - **Input Validation:** Always validate and sanitize user input before sending it to the database.

## 3. Architecture & Project Structure

### **Modular Feature-Based Architecture**

- **Domain-Driven Folders:** Organized codebase into `features/[feature-name]` to ensure high cohesion and low coupling.
- **Action-Service Separation:**
  - **Actions Layer:** Located in `features/[name]/actions/`, handling request validation (Zod), revalidation logic, and UI feedback.
  - **Data Access Layer / Service:** Contains pure database access logic. Ensures the application is Database Agnostic (facilitates migration from Supabase to other MySQL/PostgreSQL applications if needed).

### **Coding Patterns**

- **Single Responsibility:** Server Actions act as "Controllers" only—they don't contain raw SQL/DB logic directly.
- **Predictable File Naming:** Using specific naming conventions like `features/thematic/actions/thematic-programs.ts` for clarity in large-scale projects (150+ units).
