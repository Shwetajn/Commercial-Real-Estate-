# Commercial Real Estate Platform Prototype

This is a Next.js 14 App Router project set up as a prototype for a commercial real estate platform (office leasing, co-working space booking).

## Technologies Used

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + custom design tokens (see `tailwind.config.ts`)
*   **UI Components:** shadcn/ui (Radix UI primitives + Tailwind)
*   **State Management:** Zustand (`lib/store.ts`)
*   **Form Handling:** React Hook Form + Zod
*   **Theming:** next-themes (Dark/Light mode)

## Folder Structure

*   `app/`: Next.js App Router definitions.
    *   `(marketing)`: Route group for public-facing pages (Landing, About, etc.). Has a top navigation header and footer.
    *   `(dashboard)`: Route group for logged-in user dashboard. Includes a sidebar and header.
    *   `(auth)`: Route group for authentication pages (Login, Register).
*   `components/`:
    *   `ui/`: Base shadcn/ui components (buttons, inputs, cards, etc.). **Do not modify these unless necessary**.
    *   `shared/`: Reusable custom components (e.g., `Header`, `Sidebar`, `Footer`).
    *   `theme-provider.tsx`: Wrapper for next-themes.
*   `lib/`: Utility functions and stores.
    *   `mock-data/`: Dummy JSON/TS data for listings, bookings, and users to use during prototype development.
    *   `store.ts`: Zustand global state definitions.
    *   `utils.ts`: Tailwind CSS class merging utilities.
*   `types/`: TypeScript interface definitions for core entities (`Listing`, `Booking`, `User`, etc.).

## How to Add New Screens

1.  **Determine the Route Group**: Decide if the new screen belongs in `(marketing)`, `(dashboard)`, or `(auth)`.
2.  **Create the Route Folder**: Inside the appropriate route group, create a folder for the route (e.g., `app/(dashboard)/dashboard/bookings/`).
3.  **Add `page.tsx`**: Create a `page.tsx` file inside the new folder. This will be the main React component for the screen.
    ```tsx
    export default function BookingsPage() {
      return <div>My Bookings</div>;
    }
    ```
4.  **Use Mock Data**: Import data from `lib/mock-data` to populate your screen without needing a real backend.
5.  **Use UI Components**: Import pre-styled components from `components/ui` to build the interface rapidly.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
