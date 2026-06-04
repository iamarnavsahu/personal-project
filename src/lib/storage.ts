/**
 * Wrap a Supabase signed object URL into a transformed thumbnail.
 *
 * NOTE: Supabase Image Transformations are billed per request — Pro
 * includes only 100/month, then $5 per extra 1k. For a photographer
 * shipping 700+ photo galleries that quota burns out in minutes, so
 * we keep this as a passthrough.
 *
 * Re-enable the transform block below if you upgrade past that pricing
 * or are happy paying the per-request overage.
 */
export function thumbnailUrl(signedUrl: string, _size: number): string {
  return signedUrl;

  // --- Re-enable if you're OK paying for image transforms ---
  // try {
  //   const url = new URL(signedUrl);
  //   url.pathname = url.pathname.replace("/object/sign/", "/render/image/sign/");
  //   url.searchParams.set("width", String(_size));
  //   url.searchParams.set("height", String(_size));
  //   url.searchParams.set("resize", "cover");
  //   url.searchParams.set("quality", "70");
  //   return url.toString();
  // } catch {
  //   return signedUrl;
  // }
}
