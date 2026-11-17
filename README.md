# oakmerewoodcare.com

The Oakmere Wood Care website. Plain HTML, CSS and JavaScript with **no build step**: what you upload is exactly what goes live. `index.html` is the home page.

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | Home page |
| `products/` | Shop page plus one page per product |
| `beeswax-wood-polish/`, `furniture-polish/`, `cutting-board-wax/`, `food-safe-wood-finish/`, `made-in-canada-wood-care/` | Keyword pages for Google |
| `guides/` | Care guides hub and five how-to guides (the pages your Pinterest pins link to) |
| `faq/`, `about/`, `contact/`, `privacy/`, `404.html` | Information pages |
| `assets/js/site.js` | **Your settings are at the top of this file** (email, MailerLite, Pinterest) |
| `assets/css/site.css` | All the styling |
| `assets/img/` | Photos, as `.webp` with `.jpg` fallbacks |
| `assets/pins/` | 1000×1500 Pinterest pin images, one per product and guide |
| `assets/og/` | 1200×630 share images for Facebook, iMessage, Slack and others |
| `assets/video/` | The two product videos, compressed to about 1 MB each |
| `functions/api/pins.js`, `_routes.json` | Fetches your latest Pinterest pins for the moving strip |
| `sitemap.xml`, `robots.txt`, `llms.txt` | For Google, Bing and AI assistants |
| `_headers` | Cloudflare Pages settings (security and caching) |
| `site.webmanifest`, `favicon.*`, `apple-touch-icon.png` | Icons |

---

## 1. Put it on GitHub

1. Go to github.com, click **New repository**, name it `oakmere-website`, and create it. Public or private both work.
2. Click **uploading an existing file**.
3. Unzip the download, open the folder, select **everything inside it** (not the folder itself) and drag it into GitHub. `index.html` must be at the top level of the repository.
4. Click **Commit changes**.

## 2. Host it on Cloudflare Pages (free)

1. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**, and pick the `oakmere-website` repository.
2. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
3. Click **Save and Deploy**. You get a test address like `oakmere-website.pages.dev`. That address is set to `noindex`, so Google won't list it as a duplicate.
4. Open the project, go to **Custom domains**, and add `oakmerewoodcare.com`, then `www.oakmerewoodcare.com`.
   - If the domain is still at Namecheap (or another registrar), first add it to Cloudflare as a site and switch the nameservers to Cloudflare's, as you did for snoutwell.ca.
   - Delete any old parking-page **A** or **CNAME** records for `@` and `www`. Keep any email records (MX, TXT, SRV).
5. Send `www` to the main address: **Rules → Redirect Rules → Create rule → "Redirect from WWW to root"** template, with status 301.

**Updating later:** every change you commit on GitHub goes live automatically within a minute or two. Watch **Deployments** in Cloudflare for a green "Success".

### If the Cloudflare build fails

Cloudflare has two ways to host a site from GitHub, and this repository works with both:

- **Pages project:** Framework preset **None**, build command **empty**, build output directory `/`.
- **Worker project** (what the newer "Import a repository" button creates): build command **empty**, deploy command `npx wrangler deploy`. The files `wrangler.jsonc`, `worker.js` and `.assetsignore` make this work. The Worker must be named `oakmere`; if yours has another name, change the `"name"` line in `wrangler.jsonc` to match it.

If a build still fails, open the failed deployment in Cloudflare, copy the red error line from the build log, and send it over.

## 3. Let AI assistants read the site (important)

Cloudflare can block AI crawlers before they ever see `robots.txt`. In the Cloudflare dashboard for oakmerewoodcare.com:

1. **Security → Settings** (or **Security → Bots**): set **Block AI bots** to **Do not block / Allow**.
2. **AI Crawl Control → Crawlers**: set every crawler to **Allow**, especially GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot and Google-Extended.
3. Turn **Managed robots.txt** **off**, so Cloudflare serves this site's own `robots.txt` instead of its own.
4. Keep **Bot Fight Mode** off, and make sure no WAF custom rule blocks bots.

Check it: open `https://oakmerewoodcare.com/robots.txt`. The first line should read `# oakmerewoodcare.com: everyone is welcome, including AI assistants.`

## 4. Google Search Console

1. Go to search.google.com/search-console → **Add property → Domain** → enter `oakmerewoodcare.com`.
2. Google gives you a TXT record. In Cloudflare **DNS → Records → Add record**: Type `TXT`, Name `@`, Content = the value Google gave you. Then click **Verify** in Google.
3. **Sitemaps** → enter `sitemap.xml` → **Submit**.
4. **URL inspection** → paste `https://oakmerewoodcare.com/` → **Request indexing**. Do the same for the three product pages.

## 5. Bing Webmaster Tools (also feeds ChatGPT search and Copilot)

1. Go to bing.com/webmasters → sign in → **Import from Google Search Console**. This copies your verified site and sitemap.
2. If you add it manually instead, submit `https://oakmerewoodcare.com/sitemap.xml` under **Sitemaps**.

## 6. Pinterest: claim the site and use Rich Pins

1. Switch to a **Pinterest business account** if you have not already.
2. **Settings → Claimed accounts → Websites → Claim**, enter `oakmerewoodcare.com`.
3. Choose **Upload HTML file**. Download the file Pinterest gives you (it looks like `pinterest-xxxxx.html`), upload it to the top level of your GitHub repository next to `index.html`, wait for the deploy, then click **Verify** in Pinterest.
4. **Rich Pins:** every page already has the metadata Pinterest reads (Open Graph tags, plus Product and Article structured data). Once the site is claimed, pins saved from the site pick it up automatically.
5. **Pinning:** each product and guide page has a tall 1000×1500 pin image with a red **Save** button. Pin those to your boards: each pin links back to its page, and the page's buttons go to Amazon.

### The moving "From the gallery" strip

- The strip on the home page and the guides page slides slowly from left to right and pauses when someone hovers over or touches it.
- It shows your **latest pins automatically** (up to 30). A small Cloudflare function, `functions/api/pins.js`, reads the public feed of the Pinterest account `oakmerewoodcare` and refreshes about every 30 minutes. Cloudflare Pages runs it by itself: there is nothing to build or switch on. Keep the `functions` folder and `_routes.json` at the top level of the repository.
- If Pinterest can't be reached, or the account has fewer than four pins, the strip shows the 13 Oakmere pins that ship with the site instead, so it is never empty.
- To check it after going live, open `https://oakmerewoodcare.com/api/pins`. You should see a list of your pins. If you see `{"pins":[]}`, make sure the Pinterest profile is public.
- If you ever change your Pinterest username, edit the first line of `functions/api/pins.js`.

## 7. Your settings (top of `assets/js/site.js`)

Open `assets/js/site.js` on GitHub, click the pencil icon, and edit the lines at the top:

```js
MAILERLITE_FORM_URL: "",
CONTACT_EMAIL: "hello@oakmerewoodcare.com",
PINTEREST_PROFILE_URL: "https://www.pinterest.com/oakmerewoodcare/",
POPUP_DELAY_SECONDS: 6
```

- **CONTACT_EMAIL:** where sign-ups go while MailerLite isn't connected. The button opens the visitor's email app with a pre-filled sign-up message to this address, so no sign-up is lost.
- **MAILERLITE_FORM_URL:** to collect sign-ups automatically:
  1. In MailerLite, go to **Forms → Embedded forms → Create**, add only an email field, and turn on **double opt-in**.
  2. Open the form's **HTML code** and find `action="https://assets.mailerlite.com/jsonp/.../subscribe"`.
  3. Paste that full URL between the quotes.
  4. In MailerLite, create an **automation** triggered when someone joins the form's group, and have it send the 10% code. Create the code in **Amazon Seller Central → Advertising → Promotions → Percentage off**.
- **PINTEREST_PROFILE_URL:** where the "Follow Oakmere on Pinterest" buttons go.

Commit the change, and it's live within a couple of minutes. CSS and JS changes can take up to an hour to reach returning visitors, because browsers cache those files.

## 8. When you add or change a page

- New page: copy an existing page's folder and edit it. Each page needs its own `<title>`, meta description, canonical link and one `<h1>`.
- Add the new address to `sitemap.xml` and `llms.txt`, and link to it from the menu and footer in every page.
- After a big change, resubmit the sitemap in Search Console.

## Notes

- Buy buttons link straight to Amazon. Visitors in Canada see Amazon.ca first and everyone else sees Amazon.com first; both are always shown when a product is on both.
- The pop-up appears after 6 seconds, once per visitor. It never comes back after it's closed or submitted, and it doesn't appear on the Contact or Privacy pages.
- No ratings or reviews appear in the site or its structured data. Add them only when you have real ones you are allowed to quote.
- Prices on the site: 200 g tins CA$27.99 / US$18.99, 100 g tins CA$21.99, Cutting Board Oil CA$27.99. When a price changes on Amazon, update it on the product pages (search each file for the old price; it appears in the buttons, the facts table and the structured data) and in `llms.txt`.
- Videos play only when a visitor presses play, so they don't slow the pages down.
