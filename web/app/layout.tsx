import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CAVEAT } from "@/lib/content";
import { ROADMAP_REPO } from "@/lib/links";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Digital care roadmap",
    template: "%s · Digital care roadmap",
  },
  description: `Now, Next, and Later for telco digital care. ${CAVEAT}`,
  authors: [{ name: "Christopher Nguu", url: ROADMAP_REPO }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <div className="rule-top" />
        <a className="skip" href="#content">
          Skip to content
        </a>
        <div className="shell">
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
