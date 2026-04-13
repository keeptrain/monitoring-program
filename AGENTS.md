<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Next.js App Router Agent Rules

## Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui, tanstack react-table
- **Database**: Supabase (Postgresql)
- **Validation**: Zod

## 1. Project Structure

- **App Router**: Use the `app/` directory for routing.
- **Pages**: Create pages as React components inside `app/` but only for the exported components from `features` directory.
- **Layouts**: Use `layout.tsx` for shared UI.

## 2. Routing

- **File-based Routing**: Create folders for routes, e.g., `app/dashboard/page.tsx` is `/dashboard`.
- **Dynamic Routes**: Use `[slug]` syntax for dynamic segments.
- **Nested Routes**: Nest folders to create nested routes.

## 3. Data Fetching

- **Server Components**: Use `async/await` directly in components.
- **Client Components**: Use `useEffect` or libraries like SWR/React Query.
- **Server Actions**: Use `"use server"` for mutations.

## 4. Styling

- **Tailwind CSS**: Use Tailwind classes for styling.
- **Global Styles**: Use `app/globals.css` for global styles.
- **Component Styles**: Use colocated CSS modules or Tailwind.
- **Component Library**: Use `shadcn/ui` for components.

## 5. Best Practices

- **Server First**: Default to server components for better performance.
- **Streaming**: Use Suspense for streaming UI.
- **Security**: Sanitize user input before storing it in the database (supabase) using zod.

## 6. Database

- **Actions**: Use server.
- **Postgresql**: Use Postgresql for database.
- **Zod**: Use Zod for validation.

## 7. Common Pitfalls

- **Hydration Mismatch**: Ensure server and client render the same HTML.
- **Client-only Code**: Wrap in `useEffect` or use dynamic imports.

## 7. Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Styling](https://nextjs.org/docs/app/building-your-application/styling)

<!-- END:nextjs-agent-rules -->
