import Link from "next/link";

export const metadata = {
  title: "Terms — Picka",
  description: "Plain-English terms for using Picka."
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 md:py-28">
      <Link href="/" className="text-[11px] uppercase tracking-[0.3em] text-mute hover:text-ink">
        ← Back to home
      </Link>
      <p className="mt-12 text-[11px] uppercase tracking-[0.35em] text-mute">
        Last updated · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <h1 className="mt-3 font-serif text-5xl italic leading-none tracking-tightest md:text-6xl">
        Terms.
      </h1>

      <div className="mt-12 space-y-8 text-ink/80">
        <p>
          Picka is offered as-is. By using it you agree to the following,
          written in plain English so we both understand it.
        </p>

        <Section title="Your work">
          <p>
            You retain every right to the photos you upload. By uploading you
            grant Picka a limited license to store and display them to the
            people you choose to share with. Nothing more.
          </p>
        </Section>

        <Section title="What you cannot upload">
          <p>
            No content you do not own or are not licensed to display. No
            illegal content. No content depicting minors in any compromising
            way.
          </p>
        </Section>

        <Section title="Availability">
          <p>
            Picka is a small product and may have downtime. We try our best.
            Do not rely on it as your only copy of your work &mdash; keep
            originals on your own drive.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            We may suspend accounts that abuse the service. You may delete
            your account at any time.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms. Material changes will be announced
            inside your admin.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mt-10 text-[11px] uppercase tracking-[0.3em] text-mute">{title}</h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </section>
  );
}
