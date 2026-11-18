/**
 * Shared-element page transition: the product card photo that was clicked grows into the
 * product page's main photo (`.vt-product-photo` in styles.css). Browsers without the View
 * Transitions API simply navigate as before.
 *
 * Only one element per page may carry a given view-transition-name, otherwise the browser
 * skips the transition, so the name goes on the clicked card at click time rather than on
 * every card.
 */
const NAME = "product-photo";
let tagged: HTMLElement | null = null;

export function tagProductPhoto(el: HTMLElement | null) {
  tagged?.style.removeProperty("view-transition-name");
  tagged = null;
  // On a product page the main photo already carries the name; it then cross-fades in place.
  if (!el || document.querySelector(".vt-product-photo")) return;
  el.style.setProperty("view-transition-name", NAME);
  tagged = el;
}

/** Plain left clicks only: a modifier-click opens a new tab and must not leave a name behind. */
export function isPlainClick(e: {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
