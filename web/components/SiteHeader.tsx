"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { REPO_URL } from "@/lib/content";

const LINKS = [
  { href: "/", label: "Roadmap" },
  { href: "/backlog", label: "Backlog" },
  { href: "/okrs", label: "OKRs" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/">
          <span className="mark" aria-hidden="true" />
          Digital care roadmap
        </Link>
        <nav className="nav" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a className="github-link" href={REPO_URL}>
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
