# Kapuletu Frontend Agent Rules

## React & Component Guidelines
- **Components:** Always use arrow functions for components.
- **Exports:** Use `export default` ONLY if it is the single thing being exported from the file; otherwise, use named exports (no default).
- **Props:** Use `interface` specifically for prop types, and type components using `React.FC<Props>`.
- **Client Components:** Do NOT use the `"use client"` directive inside any `page.tsx` file.
> **Example:** See [src/features/shared/components/SiteLogo.tsx](../src/features/shared/components/SiteLogo.tsx) for a proper arrow function component using `React.FC<Props>`, an interface, and a named export.

## Styling & Theme
- **Theming:** Strictly use existing Tailwind CSS theme tokens (e.g. `bg-background`, `text-muted-foreground`). 
- **No Hardcoded Colors:** Do not use hardcoded colors or arbitrary square bracket values for colors anywhere.
> **Example:** Review [src/features/shared/components/SidebarLayoutClient.tsx](../src/features/shared/components/SidebarLayoutClient.tsx) which uses purely semantic tokens (`bg-background`, `border-border`, etc.) without hardcoded hex or tailwind primitives.

## Code Organization & Reusability
- **Feature Folders:** Always check the `src/features/` folder and align with feature-based architecture when creating new files.
- **Reusability Check:** Always check for existing reusable functions, utilities, and components before creating a new one to avoid duplication.
> **Example:** Code is segmented into logical boundaries like [src/features/auth](../src/features/auth) where you'll find related `components`, `services`, `utils`, etc.

## Data Fetching & API
- **API Calls:** Always use services for API calls. Use React Query hook functions (mutations or queries) that call the backend via `axios`.
- **Typing:** Ensure all API responses, payloads, and queries are strictly typed.
> **Example:** Look at [src/features/auth/services/mutations.ts](../src/features/auth/services/mutations.ts) and [src/features/auth/services/queries.ts](../src/features/auth/services/queries.ts) for typed React Query hooks calling Axios.

## Post-Processing
- **Lint & Format:** Always run linting and formatting when you are done modifying files, and proactively fix any resulting errors.

## Next.js Architecture
- **Middleware:** Never add a `middleware.ts` file to this codebase. The version of Next.js being used relies on `proxy.ts` instead.
