import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

/** Change shop filters without jumping the page back to the top. */
export function updateShopQuery(router, query) {
  const href = query ? `${WEBSITE_SHOP}?${query}` : WEBSITE_SHOP;
  const top = window.scrollY;

  router.replace(href, { scroll: false });

  const started = performance.now();
  const restore = () => {
    if (window.scrollY !== top) window.scrollTo(0, top);
    if (performance.now() - started < 500) requestAnimationFrame(restore);
  };
  requestAnimationFrame(restore);
}
