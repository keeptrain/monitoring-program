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
  - **Filenames:** Use camelCase based on action/resource (e.g., `getProposals.ts`, `updateQuota.ts`). Do NOT include the `use` prefix in the filename.
  - **Hook Exports:** The exported custom hook MUST still use the `use` prefix (e.g., `export const useGetProposals = ...`).
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

## 8. Data Validation Standards (Zod)

- **Mandatory Validation:** Every data entry point (Server Actions & API routes) MUST validate the input payload using a Zod schema before any processing or DB interaction.
- **Schema Organization:**
  - Place schemas in `features/[feature]/forms/[feature]-schema.ts`.
  - Export both the schema and its TypeScript types:

    ```typescript
    export const mySchema = z.object({ ... });
    export type MyFormInput = z.input<typeof mySchema>; // Values before transformation
    export type MyFormValues = z.output<typeof mySchema>; // Validated/transformed values
    ```

- **Type Coercion:** Use `z.coerce` to properly handle values coming from HTML forms (e.g., `z.coerce.number()` for quantity or price).
- **Safe Parsing:** Use `.safeParse()` in Server Actions to return friendly error messages to the UI without throwing unhandled exceptions.
- **Validation Logic:**
  - **Refinement:** Use `.refine()` for complex cross-field validation (e.g., ensuring `end_date` is after `start_date`).
  - **Preprocess:** Use `z.preprocess()` for cleaning up inputs (trimming strings, handling empty values) before validation.
- **Composition:** Reuse schema fragments (like `locationCoordinateSchemaPattern`) using `.extend()` or `.merge()` to ensure consistency across different features.

## 9. TypeScript Type Management

### **Location & Structure**

- Each feature must have a `features/[feature-name]/types/` folder.
- The main file is `index.ts`, which acts as a hub. If the feature is very large, split it into:
  - `entity.ts`: Main object definitions (database/domain).
  - `request.ts`: Params, QueryString, and Payload definitions.
  - `response.ts`: API result definitions (Paginated Result, Success/Error wrappers).

### **Best Practice Patterns**

1. **Naming Convention:**
   - Use **Interface** for data objects that require extensibility.
   - Use **Type** for Unions, Intersections, or Utility types.
   - Consistent suffixes: `[Entity]Params`, `[Entity]Payload`, `[Entity]Result`.

2. **API Response Pattern:**

   ```typescript
   export interface PaginatedResult<T> {
     data: T[];
     total: number;
     page: number;
     pageSize: number;
     totalPages: number;
   }
   ```

3. **Example Pattern (index.ts):**

   ```typescript
   // 1. Domain/Entity
   export interface BioflocProgram {
     id: number;
     name: string;
     province: string;
     created_at: string;
     // ... fields matching DB
   }

   // 2. Request Params (for Pagination/Filtering)
   export interface BioflocPaginationParams {
     page: number;
     pageSize: number;
     search?: string;
     province?: string;
   }

   // 3. API Response
   export type BioflocPaginatedResult = PaginatedResult<BioflocProgram>;
   ```

4. **Avoid Type Duplication:**
   - Use `Pick`, `Omit`, or `Partial` instead of creating near-identical types.
   - Leverage `z.infer<typeof schema>` from Zod to synchronize form types with TypeScript types.
