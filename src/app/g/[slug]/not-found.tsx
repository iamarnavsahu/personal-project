import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Picka." className="mx-auto h-10 w-auto" />
      <h1 className="mt-8 text-3xl font-bold">Gallery not found</h1>
      <p className="mt-3 text-ink/60">
        This link may have expired, or your photographer hasn&apos;t created
        the gallery yet. Double-check the link they shared with you.
      </p>
      <Link href="/" className="btn btn-ghost mt-8">
        Back to home
      </Link>
    </main>
  );
}
