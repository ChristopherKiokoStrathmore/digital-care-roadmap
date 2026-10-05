import Link from "next/link";

export default function NotFound() {
  return (
    <header className="page-intro">
      <p className="eyebrow">404</p>
      <h1>This page is not on the roadmap.</h1>
      <p className="lede">
        <Link href="/">Back to Now, Next, Later</Link>
      </p>
    </header>
  );
}
