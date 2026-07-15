import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

// wraps every page with the navbar and a consistent background
export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}