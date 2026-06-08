<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Communication Style

Provide answers/explanations that are very short, concise, straight to the point (point-to-point), and avoid long-winded explanations or repeating information.

## Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Postgresql (Supabase)
- **Component Library**: shadcn/ui
- **Library**:
  - Data fetching library: TanStack Query
  - Table library: TanStack Table
  - Form library: React Hook Form
  - Validation library: Zod

## Project Structure

- **App Router**: Use the `app/` directory for routing.
- **Pages**: Create pages as React components inside `app/` but only for the exported components from `features/pages` directory.

## Data Fetching

- **Server Components**: Use `async/await` directly in components.
- **Client Components**: Use React Tanstack Query.
- **Server Actions**: Use `"use server"` for mutations.

## Styling

- **Tailwind CSS**: Use Tailwind classes for styling.
- **Global Styles**: Use `app/globals.css` for global styles.
- **Component Styles**: Use colocated CSS modules or Tailwind.
- **Component Library**: Use `shadcn/ui` for components.

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Styling](https://nextjs.org/docs/app/building-your-application/styling)

<!-- END:nextjs-agent-rules -->
