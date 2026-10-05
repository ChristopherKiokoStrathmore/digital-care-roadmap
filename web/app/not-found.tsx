import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="wrap page not-found">
      <p className="kicker">404</p>
      <h1>This page is not on the board.</h1>
      <p>
        <Link className="text-link" href="/">
          Back to the roadmap
        </Link>
      </p>
    </main>
  );
}
