export const SUPPORT_EMAIL = "hello@ahabclothing.com";

export function supportEmailLink(subject: string, body: string) {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
