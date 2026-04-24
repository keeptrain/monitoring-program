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

## 4. Client-Side Data Fetching & Mutations

- **TanStack Query:** MUST use TanStack Query (React Query) for all client-side fetching and mutations to handle caching, loading states, and error handling consistently.
- **File Organization:**
  - All hooks related to data fetching/mutations must be placed in `features/[feature-name]/api/`.
  - For simple fetches, use the naming convention `useGet[ResourceName]`.
  - For mutations, use the naming convention `use[Action][ResourceName]` (e.g., `useUpdateQuota`).
- **Standard Pattern:**

  ```typescript
  // features/feature-name/api/get-resource.ts
  export const getResourceQueryKey = (params: any) => ["resource-key", params];

  export const useGetResource = (params: any, enabled = true) =>
    useQuery({
      queryKey: getResourceQueryKey(params),
      queryFn: () => getResourceAction(params),
      staleTime: 3 * 60 * 1000, // 3 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      enabled: enabled && !!params,
    });
  ```

- **Mutation Pattern:**
  - Always invalidate relevant query keys on successful mutations to ensure UI consistency.
  - Use `useMutation` from `@tanstack/react-query`.

## 5. Performance Optimization

### **Memoization Standards**

- **Stable References:** Use `useCallback` for all functions passed as props to child components (e.g., `onEdit`, `onOpen`).
- **Expensive Calculations:** Wrap complex data transformations, filtering, and sorting in `useMemo`.
- **Table Columns:** TanStack Table column definitions MUST be wrapped in `useMemo` to prevent unnecessary table re-initialization.

### **Atomic & Targeted Rendering**

- **Component Splitting:** Break down large pages into smaller, focused components. If a state update (like a search input or a toggle) only affects a specific part of the UI, move that state into a smaller sub-component.
- **Form Granularity:** Use `react-hook-form` to isolate form state. Avoid top-level `useState` for frequent input changes to prevent full-page re-renders.
- **Children Pattern:** Prefer passing components as `children` to keep them from re-rendering when the parent's unrelated state changes.

## 6. Shared & Reusable Components

- **Location:** Shared components live in `components/shared/`.
- **Leaflet Maps:** Use `dynamic(() => import(...), { ssr: false })` for all Leaflet-based components. Never import Leaflet on the server.
- **Map Pin Picker:** Use `components/shared/MapPinPicker.tsx` for any form that needs lat/long selection. It supports click-to-place, drag-to-adjust, and current-location detection.
- **Location Form:** Use `components/shared/LocationFormSection.tsx` and its exported `locationFormSchemaPattern` for consistent lat/long validation across schemas.

## 7. File Upload (Supabase Storage)

- **Reusable Component:** Use `features/documentation/components/FileUploadField.tsx` for single-file uploads to Supabase Storage.
- **Upload Hook:** Use `features/documentation/hooks/useDocumentationsUpload.ts` which wraps `useMutation` for upload state management.
- **File Naming:** Always use `generateUniqueFileName()` from `lib/utils.ts` to avoid collisions.
- **Bucket:** Stored in `process.env.NEXT_PUBLIC_SUPABASE_BUCKET`. Use `basePath` to organize files into sub-folders (e.g., `proposal-biofloc-thematic`).
