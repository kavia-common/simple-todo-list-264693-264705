import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl">
      <section className="card p-6 sm:p-8" role="alert" aria-live="assertive">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">404 – Page Not Found</h1>
          <p className="mt-2 text-gray-600">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>
        </header>
        <div>
          <Link href="/" className="btn btn-primary inline-flex" aria-label="Go back to home">
            Return Home
          </Link>
        </div>
      </section>
    </div>
  );
}
