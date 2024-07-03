"use client";

import { NavButton } from "@/components/Header";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

const Navigation = () => {
  const pathName = usePathname();
  return (
    <ul className="hidden items-center gap-x-2 lg:flex">
      {navLinks.map(({ href, label }) => (
        <NavButton
          key={label}
          href={href}
          label={label}
          isActive={pathName === href}
        />
      ))}
    </ul>
  );
};

export default Navigation;
