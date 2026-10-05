import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Digital care roadmap",
    template: "%s · Digital care roadmap",
  },
  description:
    "Now, Next, and Later sequencing for a telecom care-analytics portfolio. Three horizons and the 17-item value-versus-effort backlog, with illustrative OKRs.",
  openGraph: {
    title: "Digital care roadmap",
    description:
      "Interactive Now / Next / Later board and illustrative value-versus-effort backlog for the digital care portfolio.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
