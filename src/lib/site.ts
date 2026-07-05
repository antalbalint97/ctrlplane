export const SITE_URL = "https://ctrplane.com";
export const MENIVA_URL = "https://www.meniva.net";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
