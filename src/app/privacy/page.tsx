import Link from "next/link";

export const metadata = {
  title: "Privacy — Picka",
  description: "How Picka handles your photos and your people's privacy."
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

      <div className="mt-12 space-y-6 text-ink/80">
        <p>
          Picka is a better way to share photos. We try to handle your work,
          and your people&rsquo;s data, the way photography itself deserves
          &mdash; with care.
        </p>

        <Section title="What we keep">
          <p>
            When you sign in we store your email and an encrypted password.
            When you create a gallery we store its name, the name of whoever
            you&rsquo;re sharing with (if you set one), an encrypted passcode,
            and the photos you upload. That&rsquo;s the list.
          </p>
        </Section>

        <Section title="Where photos live">
          <p>
            Uploads sit in private, encrypted storage. They are never publicly
            indexable. Whoever you share with sees them through signed URLs
            that expire after one hour and refresh on each visit.
          </p>
        </Section>

        <Section title="What your people see">
          <p>
            Only the gallery you shared, after entering the passcode. No
            account, no sign up, and no view into any other shoot. We store
            the photos they choose &mdash; nothing else about them.
          </p>
        </Section>

        <Section title="What we never do">
          <ul className="ml-6 list-disc space-y-2">
            <li>We do not sell, share, or rent your data.</li>
            <li>We do not train AI models on your photos.</li>
            <li>We do not run ad networks or third-party trackers.</li>
            <li>We do not look at your galleries.</li>
          </ul>
        </Section>

        <Section title="Deletion">
          <p>
            Delete a gallery from the admin and the photos and selections are
            wiped immediately. Reach out from the dashboard to fully delete
            your account.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Two cookies. One keeps you signed in on the admin side. One
            remembers that your visitor entered the correct passcode for a
            gallery. Both are httpOnly and sameSite=lax. No analytics cookies.
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
