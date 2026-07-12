# Maygun Laundry — Website

**Tagline:** Clean and Fresh
**Hero Title:** Premium Laundry & Dry Cleaning

A complete, production-ready, fully responsive website for Maygun Laundry — built with plain HTML5, CSS3 and vanilla JavaScript. No frameworks, no build step required.

## Project Structure

```
maygun-laundry/
├── index.html              Home page
├── about.html               About Us page
├── services.html            Services page (6 detailed services)
├── pricing.html              Full price list (tabbed, from rate card)
├── gallery.html               Gallery page (filterable, with lightbox)
├── contact.html                Contact page (map, booking + enquiry forms)
├── contact-handler.php          Optional PHP mail handler (not enabled by default)
├── robots.txt                    SEO — search engine crawling rules
├── sitemap.xml                     SEO — sitemap for search engines
├── assets/
│   ├── css/style.css                 All styles (theme, layout, responsive, animations)
│   ├── js/main.js                     All interactivity (nav, forms, sliders, tabs, lightbox)
│   └── images/
│       ├── logo.png                    Brand logo (header/footer/hero)
│       └── favicon-*.png / .ico          Generated favicons
└── README.md
```

## Tech Stack

- HTML5 (semantic, SEO-friendly markup)
- CSS3 (custom properties, Grid/Flexbox, animations — no CSS framework)
- Vanilla JavaScript (no jQuery, no build tools)
- PHP — optional only (`contact-handler.php`), not required for the site to work
- Fully responsive: mobile, tablet, desktop

## Key Features

- Sticky, responsive navbar with mobile hamburger menu
- Hero section with dual CTAs ("Book on WhatsApp" + "View Pricing")
- Pickup & Delivery 3-step process section
- 6 service cards (Laundry, Dry Cleaning, Steam Iron, Shoe Cleaning, Bag Cleaning, Household Cleaning)
- WhatsApp booking form (Name, Phone, Address, Service, Pickup Date) — submits by opening WhatsApp with a pre-filled message
- Why Choose Us, Price Preview, and Testimonials (auto-rotating slider) sections
- Full pricing page with tabbed categories, built directly from the supplied rate card
- Filterable gallery with a lightweight lightbox (icon-based placeholder visuals — see note below)
- Contact page with address, click-to-call, embedded Google Map (no API key needed), booking form, and a general enquiry form
- Floating WhatsApp button + "back to top" button on every page
- Scroll-reveal animations, smooth scrolling, SEO meta tags, Open Graph tags, and `LaundryService` JSON-LD structured data

## WhatsApp Number

The temporary number **8989898989** is wired throughout the site as `918989898989` (India country code + number) in `assets/js/main.js` (`WHATSAPP_NUMBER` constant) and in every `wa.me` link across the HTML files.

**When you get your permanent business WhatsApp number:**
1. Open `assets/js/main.js` and update the `WHATSAPP_NUMBER` constant near the top.
2. Find-and-replace `918989898989` across all `.html` files (used in nav buttons, hero CTA, floating button, footer, CTA bands, and service "Book Now" links).

## Pricing Data

All prices in `pricing.html` were transcribed directly from the supplied rate card PDF (`RateCardT255.pdf`), covering: Men's Wear, Women's Wear, Woolen, Household, Shoes, Bags, and Laundry (per-Kg). Items marked with **+** indicate the price may vary based on fabric, embellishment, or design — noted clearly on the page.

## Gallery Images

No real photographs were supplied, so the Gallery page uses clean, icon-based visual tiles (SVG icons on gradient backgrounds) as intentional placeholders rather than blank/broken images. **Before going fully live, replace these with real photos** of your facility, staff, and finished garments:

1. Add photos to `assets/images/gallery/` (create this folder).
2. In `gallery.html`, replace each `.gallery-item`'s inner `<svg>` with an `<img src="assets/images/gallery/your-photo.jpg" alt="...">`.
3. Update the CSS class `.gallery-item` background rules in `style.css` if you want to remove the gradient fallback.

## Domains

- **Testing:** addvcoupons.online
- **Final/Production:** maygunlaundry.in

Canonical URLs, Open Graph URLs, and JSON-LD data across all pages are pre-set to `https://www.maygunlaundry.in/`. When testing on `addvcoupons.online`, these tags won't match the live URL — that's fine for functional testing, but **update every `<link rel="canonical">`, `og:url`, and JSON-LD `url`/`@id` field to your final domain before launch** (or update them once if testing and production domains differ from what's set).

## Deployment

This is a static site (plus one optional PHP file) — it can be deployed to **any** standard web host:

- Upload the entire `maygun-laundry/` folder contents to your web root (e.g. `public_html/`) via FTP/cPanel File Manager.
- No build step, no `npm install`, no server configuration required.
- If you enable `contact-handler.php` (see comments in that file), your host must support PHP's `mail()` function — true for virtually all shared hosting providers used for `.in` domains.

## Local Preview

Since this is a static site, you can preview it by simply opening `index.html` in a browser, or serve it locally:

```bash
cd maygun-laundry
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customization Checklist

- [ ] Replace temporary WhatsApp number `8989898989` with your permanent number (see above)
- [ ] Add real photography to the Gallery page
- [ ] Update canonical/OG URLs when moving from testing to production domain
- [ ] Replace placeholder testimonials with real customer reviews
- [ ] Add real social media links in the footer (`#` placeholders currently)
- [ ] Verify pricing against your latest rate card before launch
