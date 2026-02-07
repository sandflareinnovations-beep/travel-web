# Travel Web Frontend (Next.js)

This is the frontend client for the Travel Web application, built with [Next.js](https://nextjs.org/) (App Router), TypeScript, and Tailwind CSS. It provides a modern, responsive interface for flight searching, booking management, and user profiles.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives) + [Lucide Icons](https://lucide.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) Validation
- **Date Handling:** [Date-fns](https://date-fns.org/)

## 📂 Project Structure

```bash
frontend/
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # UI components (buttons, inputs, dialogs, etc.)
│   ├── lib/            # Utility functions and API client (api.ts)
│   ├── store/          # Zustand global state stores
│   └── globals.css     # Global styles and Tailwind directives
├── public/             # Static assets
└── ...config files (tailwind, next, typescript, etc.)
```

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Setup Environment Variables:
   Create a `.env.local` file in the root of the `frontend` directory. Add any necessary environment variables (e.g., API URLs, keys).
   
   Example `.env.local`:
   ```env
   # Example variables (replace with actual values)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Runs the app in development mode with hot-reloading.
- `npm run build`: Builds the app for production.
- `npm start`: Starts the production server (requires build first).
- `npm run lint`: Runs ESLint to check for code quality issues.

## ✨ Key Features

- **Flight Search:** Advanced search capabilities with filters for price, duration, and airlines.
- **Booking Flow:** Seamless booking process from selection to payment.
- **User Dashboard:** Manage profile and view booking history.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## 📄 License

This project is private and proprietary.
