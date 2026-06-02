/**
 * Convert a Supabase signed object URL into a signed render URL with
 * an on-the-fly resize. Image Transformations are a Supabase Storage
 * feature: the same JWT used for /object/sign is accepted by
 * /render/image/sign, so we can swap the path and append width/height.
 *
 * If transforms aren't enabled on the project's plan, the request
 * 404s. The <img> tag should set a fallback to the original URL via
 * onError; on the server we always return the transformed URL alongside
 * the original so the client can decide.
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
