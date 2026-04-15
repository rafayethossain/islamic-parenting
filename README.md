# Raising Children of Jannah | জান্নাতের সন্তান গড়ে তোলা

A digital toolkit and PWA (Progressive Web App) providing a Prophetic blueprint for character, discipline, and digital resilience in parenting.

## Features

- **Multi-language Support**: Full content available in both English (`en/`) and Bengali (`bn/`).
- **PWA Ready**: Can be installed on any device for offline reading.
- **Dark Mode**: Eye-friendly reading experience for night-time parenting.
- **Reading Progress**: Automatically tracks and displays reading progress across chapters.
- **Smart Redirection**: Remembers your preferred language and defaults to Bengali for first-time visitors.
- **Print Friendly**: Optimized CSS for printing chapters.

## Project Structure

```text
├── index.html          # Main entry (Language Redirector)
├── manifest.webmanifest # PWA Configuration
├── sw.js               # Service Worker (Offline Caching)
├── bn/                 # Bengali Version
│   ├── index.html      # Bengali Introduction
│   ├── assets/         # Bengali-specific assets (CSS, JS, Icons)
│   └── chapters/       # Bengali Chapter files
└── en/                 # English Version
    ├── index.html      # English Introduction
    ├── assets/         # English-specific assets (CSS, JS, Icons)
    └── chapters/       # English Chapter files
```

## How to Maintain

### Adding a New Chapter
1.  Create a new HTML file in both `bn/chapters/` and `en/chapters/`.
2.  Follow the template from `chapter-01.html`.
3.  Add the new file to the sidebar navigation in ALL HTML files.
4.  Update the `sw.js` `chapters` array to include the new filename for offline caching.
5.  Update the `sitemap.xml` with the new URLs.

### Updating the Service Worker
When you make changes to CSS or JS, increment the `CACHE_NAME` version in `sw.js` (e.g., `v3` to `v4`) to force an update for all users.

## Deployment
Hosted on GitHub Pages at [https://rafayethossain.github.io/islamic-parenting](https://rafayethossain.github.io/islamic-parenting).

---
*May Allah make our children the coolness of our eyes and leaders of the righteous.*
