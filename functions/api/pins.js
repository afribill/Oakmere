// Cloudflare Pages Function: returns Oakmere's latest Pinterest pins as JSON.
// The site's "From our Pinterest" strip calls /api/pins and shows whatever comes back,
// so new pins appear on the site automatically (refreshed about every 30 minutes).
const PINTEREST_USERNAME = "oakmerewoodcare";

const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

export async function onRequestGet() {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=1800" };
  try {
    const res = await fetch(`https://www.pinterest.com/${PINTEREST_USERNAME}/feed.rss`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OakmereSite/1.0; +https://oakmerewoodcare.com)" },
      cf: { cacheTtl: 1800, cacheEverything: true },
    });
    if (!res.ok) throw new Error("feed " + res.status);
    const xml = await res.text();
    const pins = [];
    for (const item of xml.split(/<item>/i).slice(1, 31)) {
      const title = decode((item.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "").trim();
      const link = decode((item.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "").trim();
      const desc = decode((item.match(/<description>([\s\S]*?)<\/description>/i) || [])[1] || "");
      let image = (desc.match(/<img[^>]+src="([^"]+)"/i) || [])[1] || "";
      image = image.replace(/\/(?:\d+x\d*|originals)\//, "/564x/");
      if (/^https:\/\/([a-z]+\.)?pinterest\.[a-z.]+\/pin\//i.test(link) && /^https:\/\/i\.pinimg\.com\//i.test(image)) {
        pins.push({ title: title.slice(0, 140) || "Oakmere on Pinterest", link, image });
      }
    }
    return new Response(JSON.stringify({ pins }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ pins: [] }), { headers });
  }
}
