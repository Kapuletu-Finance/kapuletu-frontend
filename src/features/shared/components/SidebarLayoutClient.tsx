"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import type { UserRole } from "@/features/auth/utils";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

// A mock definition for the WorkspaceSwitcher.
// In a real scenario, this would be imported from "@/features/shared/components/WorkspaceSwitcher"
const WorkspaceSwitcher = () => (
  <div className="p-2 border rounded bg-white text-sm text-gray-700">
    <select className="bg-transparent outline-none cursor-pointer" aria-label="Select Workspace">
      <option value="chama-1">Chama Workspace Alpha</option>
      <option value="chama-2">Chama Workspace Beta</option>
    </select>
  </div>
);

export const SidebarLayoutClient = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) => {
  const pathname = usePathname();

  const isTreasurer = role === "treasurer";
  const links = role === "admin" ? ADMIN_LINKS : TREASURER_LINKS;

  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
        <div className="h-16 flex items-center justify-center border-b border-slate-800 text-white font-bold text-lg tracking-wider">
          KapuLetu {role === "admin" ? "Admin" : "Treasurer"}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white font-medium"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
          <div className="font-semibold text-gray-800 truncate">
            {role === "admin" ? "Admin Dashboard" : "Treasurer Dashboard"}
          </div>

          <div className="flex items-center space-x-4">
            {/* Embed Workspace Switcher for Treasurers only */}
            {isTreasurer && <WorkspaceSwitcher />}

            <ThemeToggle />

            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer">
              {role === "admin" ? "A" : "T"}
            </div>

            <SignOutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation (Responsive Fallback) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-400 border-t border-slate-800 flex justify-around p-2 z-50">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center p-2 rounded-md ${
                isActive ? "text-white" : "hover:text-white"
              }`}
            >
              <span className="text-xs truncate max-w-20 text-center">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/groups", label: "Groups" },
  { href: "/admin/audit/logs", label: "Audit Logs" },
];

const TREASURER_LINKS = [
  { href: "/treasurer/transactions", label: "Transactions" },
  { href: "/treasurer/ledger", label: "Ledger" },
  { href: "/treasurer/campaigns", label: "Campaigns" },
  { href: "/treasurer/members", label: "Members" },
];
