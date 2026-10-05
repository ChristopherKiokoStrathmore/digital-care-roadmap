"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROADMAP_REPO } from "@/lib/links";

const NAV = [
  { href: "/", label: "Roadmap" },
  { href: "/backlog", label: "Backlog" },
  { href: "/okrs", label: "OKRs" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        <span className="mark" aria-hidden="true" />
        <span>Digital care roadmap</span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {NAV.map((item) => {
          const current = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <a className="github-link" href={ROADMAP_REPO}>
        GitHub
      </a>
    </header>
  );
}
