import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Picka",
  description: "How Picka handles your photos and your client's data."
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 md:py-28">
      <Link href="/" className="text-[11px] uppercase tracking-[0.3em] text-mute hover:text-ink">
        ← Back to home
      </Link>
      <p className="mt-12 text-[11px] uppercase tracking-[0.35em] text-mute">
        Last updated · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <h1 className="mt-3 font-serif text-5xl italic leading-none tracking-tightest md:text-6xl">
        Privacy.
      </h1>

      <div className="prose-picka mt-12 space-y-6 text-ink/80">
        <p>
          Picka is a small tool built by one photographer for other photographers.
          We try to handle your work, and your client&rsquo;s privacy, the way we&rsquo;d
          want our own handled.
        </p>

        <Section title="What we store">
          <p>
            When you sign in we store your email and an encrypted password. When you
            create a gallery we store its name, your client&rsquo;s name (if you set one),
            a bcrypt-hashed passcode, and the JPEGs you upload. That&rsquo;s it.
          </p>
        </Section>

        <Section title="Where photos live">
          <p>
            Uploads sit in a private Supabase storage bucket. They are never publicly
            indexable. Your client sees them via signed URLs that expire after one
            hour and are regenerated each visit.
          </p>
        </Section>

        <Section title="What clients see">
          <p>
            Clients see only the gallery you shared, after entering the passcode. They
            do not sign up, do not create an account, and cannot see any other shoot.
            We store the photos they pick, nothing else about them.
          </p>
        </Section>

        <Section title="What we do not do">
          <ul className="ml-6 list-disc space-y-2">
            <li>We do not sell, share, or rent your data.</li>
            <li>We do not train AI models on your photos.</li>
            <li>We do not run ad networks or third-party trackers.</li>
            <li>We do not look at your galleries.</li>
          </ul>
        </Section>

        <Section title="Deletion">
          <p>
            Delete any gallery from the admin and the photos plus their selections
            are wiped from storage immediately. Email{" "}
            <a href="mailto:asahu@ucsd.edu" className="underline">
              asahu@ucsd.edu
            </a>{" "}
            to fully delete your account.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Two cookies: one keeps you signed in on the admin side, one remembers
            that your client has entered the correct passcode. Both are httpOnly and
            sameSite=lax. No analytics cookies.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Email{" "}
            <a href="mailto:asahu@ucsd.edu" className="underline">
              asahu@ucsd.edu
            </a>
            . A real person will read it.
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
