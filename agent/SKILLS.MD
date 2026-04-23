# 1. Type Definitions

- **No Implicit Any:** Forbidden to use `any`. Always define interfaces or types.
- **Discriminated Unions:** Used for handling UI states (e.g., `type State = { status: 'success', data: T } | { status: 'error', error: string }`).
- **Const Assertions:** Use `as const` for fixed configurations (Tables, Routes, Roles) to enable literal type narrowing.

## 2. Database & Supabase

- **Schema & Tables:**
  - **Source of Truth:** Always refer to the `schema.sql` file in the `supabase/database/migrations` directory for the definitive database schema.
  - **Table Naming:** Use the exact table names defined in `supabase/database/migrations` (e.g., `biofloc_thematic_programs`, `minapadi_thematic_programs`).
  - **Column Names:** Use the exact column names from the schema (e.g., `progress_percent`, `distribution_amount`).
  - **Enums:** Use the exact enum values defined in the schema (e.g., `biofloc_thematic`, `minapadi_thematic`, `isf`).
- **Supabase Client:**
  - **Location:** Use the client from `@/utils/supabase`.
  - **Usage:** Import `createClient` and use it to create a Supabase client instance.
- **Data Fetching:**
  - **Server Actions:** Use server actions for all database operations.
  - **Type Safety:** Always parse and validate data from Supabase using Zod schemas to ensure type safety.
  - **Error Handling:** Always handle potential errors from Supabase operations.
- **Security:**
  - **Row Level Security (RLS):** Assume RLS is enabled. Do not bypass RLS policies. Use `auth.uid()` or appropriate user context when needed.
  - **Input Validation:** Always validate and sanitize user input before sending it to the database.
