/**
 * Wrap a Supabase signed object URL into a transformed thumbnail.
 * Requires the project to be on the Supabase Pro plan (Image
 * Transformations are a Pro-tier feature).
 *
 * The same JWT used for /object/sign/ is accepted by
 * /render/image/sign/, so we swap the path and append width,
 * height, resize mode, and quality. On the Free tier this URL
 * 404s — flip the early return back on if you ever downgrade.
 */
export function thumbnailUrl(signedUrl: string, size: number): string {
  try {
    const url = new URL(signedUrl);
    url.pathname = url.pathname.replace("/object/sign/", "/render/image/sign/");
    url.searchParams.set("width", String(size));
    url.searchParams.set("height", String(size));
    url.searchParams.set("resize", "cover");
    url.searchParams.set("quality", "70");
    return url.toString();
  } catch {
    return signedUrl;
  }
}
