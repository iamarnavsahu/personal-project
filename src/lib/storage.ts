/**
 * Wrap a Supabase signed object URL into a transformed thumbnail.
 *
 * NOTE: Supabase Image Transformations are a Pro-tier feature. On the
 * Free tier the /render/image/sign/ endpoint returns 404, so we keep
 * this as a passthrough until the project is upgraded.
 *
 * When you move to Pro, re-enable the resize by uncommenting the
 * block below and removing the early return.
 */
export function thumbnailUrl(signedUrl: string, _size: number): string {
  return signedUrl;

  // --- Re-enable on Supabase Pro ---
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
